import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGE_LABELS, threadQuery, type StudyLanguage } from "@/lib/threads";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(threadQuery(params.threadId)),
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  return <ChatWindow key={threadId} threadId={threadId} />;
}

const STARTERS = [
  "Explain cloud computing using M-Pesa as an example",
  "IaaS vs PaaS vs SaaS — explain with matatus",
  "Give me 3 AZ-900 exam-style practice questions",
  "What are Azure regions? Are there any in Africa?",
];

function ChatWindow({ threadId }: { threadId: string }) {
  const { data } = useSuspenseQuery(threadQuery(threadId));
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState<StudyLanguage>((data.thread?.language as StudyLanguage) ?? "english");
  const langRef = useRef(language);
  langRef.current = language;
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: data.messages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: async (): Promise<Record<string, string>> => {
        const { data: s } = await supabase.auth.getSession();
        return s.session ? { Authorization: `Bearer ${s.session.access_token}` } : {};
      },
      body: () => ({ threadId, language: langRef.current }),
    }),
    onError: (err) => toast.error(err.message || "Network error — please try again."),
    onFinish: ({ messages: all }) => {
      queryClient.setQueryData(threadQuery(threadId).queryKey, (old) =>
        old ? { ...old, messages: all as UIMessage[] } : old,
      );
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!busy) document.querySelector<HTMLTextAreaElement>("textarea[name='message']")?.focus();
  }, [busy]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  }

  if (!data.thread) {
    return <div className="flex flex-1 items-center justify-center text-muted-foreground">Topic not found.</div>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b px-6 py-3">
        <h2 className="truncate text-base font-semibold">{data.thread.title}</h2>
        <div className="flex shrink-0 rounded-full border bg-card p-1" role="group" aria-label="Answer language">
          {(Object.keys(LANGUAGE_LABELS) as StudyLanguage[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLanguage(l)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                language === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {LANGUAGE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center pt-10 text-center">
              <img src={logo} alt="Mwalimu Cloud" width={88} height={88} className="h-22 w-22" />
              <h1 className="mt-4 text-3xl font-extrabold">Habari! What shall we learn?</h1>
              <p className="mt-2 max-w-md text-muted-foreground">
                Ask me any Azure concept and I'll explain it simply, with examples from home.
              </p>
              <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border bg-card p-4 text-left text-sm transition hover:border-accent hover:shadow-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message from={m.role} key={m.id}>
                <MessageContent
                  className={
                    m.role === "user"
                      ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                      : "bg-transparent"
                  }
                >
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      m.role === "assistant" ? (
                        <MessageResponse key={i}>{p.text}</MessageResponse>
                      ) : (
                        <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                      )
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <div className="text-sm">
              <Shimmer>Mwalimu is thinking…</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-6 pb-6">
        <PromptInput onSubmit={(msg) => send(msg.text ?? "")}>
          <PromptInputTextarea
            name="message"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any Azure concept, or request practice questions…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !input.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
