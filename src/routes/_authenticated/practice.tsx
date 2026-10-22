import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PRACTICE_CATEGORIES,
  PRACTICE_QUESTIONS,
  type PracticeCategory,
} from "@/lib/practice";

export const Route = createFileRoute("/_authenticated/practice")({
  head: () => ({
    meta: [
      { title: "Practice questions — Mwalimu Cloud" },
      {
        name: "description",
        content:
          "AZ-900-style practice questions with instant feedback and African examples.",
      },
      { property: "og:title", content: "Practice questions — Mwalimu Cloud" },
      {
        property: "og:description",
        content:
          "AZ-900-style practice questions with instant feedback and African examples.",
      },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  const [category, setCategory] = useState<PracticeCategory | "All">("All");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const questions = useMemo(
    () =>
      category === "All"
        ? PRACTICE_QUESTIONS
        : PRACTICE_QUESTIONS.filter((q) => q.category === category),
    [category],
  );

  function chooseCategory(c: PracticeCategory | "All") {
    setCategory(c);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setAnsweredCount(0);
  }

  const q = questions[index];
  const done = !q;

  function pick(i: number) {
    if (!q || picked !== null) return;
    setPicked(i);
    setAnsweredCount((n) => n + 1);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((n) => n + 1);
    setPicked(null);
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="kente-strip" />
      <header className="flex items-center justify-between border-b px-6 py-3">
        <Link to="/chat" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to topics
        </Link>
        <span className="flex items-center gap-2 text-sm font-medium">
          <Trophy className="h-4 w-4 text-accent" aria-hidden />
          {answeredCount > 0 ? `Score ${score}/${answeredCount}` : "Exam-style practice"}
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        <h1 className="font-display text-2xl font-extrabold">Practice questions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AZ-900-style exam practice — pick an answer to see if it's correct, with an
          explanation from home.
        </p>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {(["All", ...PRACTICE_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => chooseCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {done ? (
          <div className="mt-10 flex flex-col items-center rounded-xl border bg-card p-8 text-center">
            <Trophy className="h-10 w-10 text-accent" aria-hidden />
            <h2 className="mt-3 font-display text-xl font-bold">
              {score}/{questions.length} correct — umefanya poa!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {score === questions.length
                ? "Perfect score. You're exam ready!"
                : "Review the explanations, then try again or ask Mwalimu about the ones you missed."}
            </p>
            <Button onClick={() => chooseCategory(category)} className="mt-5 gap-2">
              <RotateCcw className="h-4 w-4" /> Try again
            </Button>
          </div>
        ) : (
          <section key={q.id} className="mt-6 rounded-xl border bg-card p-6 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {q.category} · Question {index + 1} of {questions.length}
            </p>
            <h2 className="mt-2 text-base font-semibold leading-relaxed">{q.question}</h2>

            <div className="mt-5 grid gap-2">
              {q.options.map((opt, i) => {
                const isAnswer = i === q.answer;
                const isPicked = picked === i;
                const state =
                  picked === null
                    ? "idle"
                    : isAnswer
                      ? "correct"
                      : isPicked
                        ? "wrong"
                        : "muted";
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    aria-pressed={isPicked}
                    className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                      state === "idle"
                        ? "hover:border-accent hover:bg-accent/5"
                        : state === "correct"
                          ? "border-primary bg-primary/10"
                          : state === "wrong"
                            ? "border-destructive bg-destructive/10"
                            : "opacity-50"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {state === "correct" ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
                      ) : state === "wrong" ? (
                        <XCircle className="h-4 w-4 text-destructive" aria-hidden />
                      ) : (
                        <span className="font-semibold opacity-60">{"ABCD"[i]}</span>
                      )}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="mt-5 rounded-lg border border-accent/40 bg-accent/5 p-4 text-sm">
                <p className="font-semibold">{picked === q.answer ? "Correct! 🎉" : "Not quite."}</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">{q.explanation}</p>
                <Button onClick={next} size="sm" className="mt-3">
                  {index + 1 === questions.length ? "See results" : "Next question"}
                </Button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
