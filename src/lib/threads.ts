import { queryOptions } from "@tanstack/react-query";
import type { UIMessage } from "ai";
import { supabase } from "@/integrations/supabase/client";

export type StudyLanguage = "english" | "swahili" | "sheng";

export const LANGUAGE_LABELS: Record<StudyLanguage, string> = {
  english: "English",
  swahili: "Kiswahili",
  sheng: "Sheng",
};

export const threadsQuery = queryOptions({
  queryKey: ["threads"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("threads")
      .select("id, title, language, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const threadQuery = (threadId: string) =>
  queryOptions({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      const [{ data: thread, error: tErr }, { data: rows, error: mErr }] = await Promise.all([
        supabase.from("threads").select("id, title, language").eq("id", threadId).maybeSingle(),
        supabase
          .from("messages")
          .select("message_id, role, parts")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: true }),
      ]);
      if (tErr) throw tErr;
      if (mErr) throw mErr;
      const messages: UIMessage[] = (rows ?? []).map((r) => ({
        id: r.message_id,
        role: r.role as UIMessage["role"],
        parts: r.parts as unknown as UIMessage["parts"],
      }));
      return { thread, messages };
    },
    staleTime: Infinity,
  });

export async function createThread() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("threads")
    .insert({ user_id: u.user.id })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}
