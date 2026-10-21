import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai/run-id.server";
import { buildTutorPrompt, type StudyLanguage } from "@/lib/ai/tutor-prompt.server";

const LANGS: StudyLanguage[] = ["english", "swahili", "sheng"];

function userClient(token: string) {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        headers.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function titleFrom(msg: UIMessage) {
  const text = msg.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();
  return text.length > 48 ? text.slice(0, 48).trimEnd() + "…" : text || "New topic";
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return Response.json({ error: "Please sign in." }, { status: 401 });
        const supabase = userClient(token);
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData.user) return Response.json({ error: "Please sign in." }, { status: 401 });
        const userId = userData.user.id;

        const body = (await request.json()) as { messages?: UIMessage[]; threadId?: string; language?: string };
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const threadId = typeof body.threadId === "string" ? body.threadId : "";
        const language: StudyLanguage = LANGS.includes(body.language as StudyLanguage)
          ? (body.language as StudyLanguage)
          : "english";
        if (!threadId || messages.length === 0) return Response.json({ error: "Invalid request" }, { status: 400 });

        const { data: thread } = await supabase.from("threads").select("id, title").eq("id", threadId).maybeSingle();
        if (!thread) return Response.json({ error: "Topic not found" }, { status: 404 });

        const last = messages[messages.length - 1];
        if (!last) return Response.json({ error: "Invalid request" }, { status: 400 });
        if (last.role === "user") {
          const { error } = await supabase.from("messages").upsert(
            { thread_id: threadId, user_id: userId, message_id: last.id, role: "user", parts: last.parts as unknown as Json },
            { onConflict: "thread_id,message_id" },
          );
          if (error) console.error("save user message failed", error);
          const update: { updated_at: string; language: string; title?: string } = {
            updated_at: new Date().toISOString(),
            language,
          };
          if (thread.title === "New topic") update.title = titleFrom(last);
          await supabase.from("threads").update(update).eq("id", threadId);
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });
        const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });

        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: buildTutorPrompt(language),
          messages: await convertToModelMessages(messages),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: messages,
          sendReasoning: true,
          onError: (err) => {
            console.error("chat stream error", err);
            const msg = err instanceof Error ? err.message : "";
            if (msg.includes("429")) return "Too many requests right now — please wait a moment and try again.";
            if (msg.includes("402")) return "AI credits have run out for this workspace.";
            return "Sorry, something went wrong answering that. Please try again.";
          },
          onFinish: async ({ responseMessage }) => {
            if (!responseMessage || responseMessage.parts.length === 0) return;
            const { error } = await supabase.from("messages").upsert(
              {
                thread_id: threadId,
                user_id: userId,
                message_id: responseMessage.id,
                role: "assistant",
                parts: responseMessage.parts as unknown as Json,
              },
              { onConflict: "thread_id,message_id" },
            );
            if (error) console.error("save assistant message failed", error);
          },
        });
        return withLovableAiGatewayRunIdHeader(response, runIdFetch);
      },
    },
  },
});
