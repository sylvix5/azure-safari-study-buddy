import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { GraduationCap, LogOut, MessageSquareText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createThread, threadsQuery } from "@/lib/threads";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Study topics — Mwalimu Cloud" },
      { name: "description", content: "Your Azure study topics and practice sessions." },
      { property: "og:title", content: "Study topics — Mwalimu Cloud" },
      { property: "og:description", content: "Your Azure study topics and practice sessions." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(threadsQuery),
  component: ChatLayout,
});

function ChatLayout() {
  const { data: threads } = useSuspenseQuery(threadsQuery);
  const params = useParams({ strict: false }) as { threadId?: string };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function newTopic() {
    try {
      const id = await createThread();
      await queryClient.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create topic");
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from("threads").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["threads"] });
    if (params.threadId === id) navigate({ to: "/chat" });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="kente-strip" />
        <div className="flex items-center gap-2 px-5 py-5">
          <img src={logo} alt="" width={36} height={36} className="h-9 w-9 rounded-full bg-sidebar-foreground p-1" />
          <span className="font-display text-lg font-bold">Mwalimu Cloud</span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2 px-3">
          <Button onClick={newTopic} className="w-full justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
            <Plus className="h-4 w-4" /> New topic
          </Button>
          <Button asChild variant="outline" className="justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/60">
            <Link to="/practice">
              <GraduationCap className="h-4 w-4" /> Practice
            </Link>
          </Button>
        </div>
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
          {threads.length === 0 && <p className="px-2 text-sm opacity-70">No topics yet.</p>}
          {threads.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center rounded-lg ${params.threadId === t.id ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"}`}
            >
              <Link
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-sm"
              >
                <MessageSquareText className="h-4 w-4 shrink-0 opacity-70" />
                <span className="truncate">{t.title}</span>
              </Link>
              <button
                type="button"
                aria-label="Delete topic"
                onClick={() => remove(t.id)}
                className="mr-1 rounded p-1.5 opacity-0 transition group-hover:opacity-70 hover:!opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </nav>
        <button onClick={signOut} className="flex items-center gap-2 border-t border-sidebar-border px-5 py-4 text-sm opacity-80 hover:opacity-100">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-2 md:hidden">
          <span className="font-display font-bold">Mwalimu Cloud</span>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/practice">Practice</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={newTopic}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
