import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "@lovable.dev/cloud-auth-js/styles.css";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Mwalimu Cloud" },
      { name: "description", content: "Sign in to save your Azure study topics and practice questions." },
      { property: "og:title", content: "Sign in — Mwalimu Cloud" },
      { property: "og:description", content: "Sign in to save your Azure study topics and practice questions." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/chat", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/chat", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (!data.session) toast.success("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "lovable") {
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/auth" });
    if (result.error) toast.error(result.error.message ?? "Sign-in failed");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="kente-strip" />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-soft">
          <Link to="/" className="mb-6 flex items-center gap-2">
            <img src={logo} alt="" width={40} height={40} className="h-10 w-10" />
            <span className="font-display text-xl font-bold">Mwalimu Cloud</span>
          </Link>
          <h1 className="text-2xl font-bold">{mode === "signin" ? "Karibu tena!" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your study topics are saved to your account.</p>

          <div className="mt-6 space-y-2">
            <Button type="button" variant="outline" className="w-full" onClick={() => social("google")}>
              Continue with Google
            </Button>
            <button type="button" className="lovable-auth-button w-full" onClick={() => social("lovable")}>
              Continue with Lovable
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {mode === "signin" ? "Sign in" : "Sign up"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
