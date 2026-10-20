import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, Languages, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mwalimu Cloud — Learn Azure the African way" },
      {
        name: "description",
        content: "An AI study buddy that explains Azure with M-Pesa, matatu and real African examples, in English, Kiswahili or Sheng — plus AZ-900 exam-style practice.",
      },
      { property: "og:title", content: "Mwalimu Cloud — Learn Azure the African way" },
      {
        property: "og:description",
        content: "Azure explained simply with African examples, in English, Kiswahili or Sheng, with exam-style practice questions.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: MapPin, title: "African examples", text: "Cloud scaling explained like M-Pesa on payday. Pay-as-you-go like a matatu fare." },
  { icon: Languages, title: "Your language", text: "Switch between English, Kiswahili and Sheng anytime in a topic." },
  { icon: BookOpenCheck, title: "Exam-style practice", text: "AZ-900 style questions, with explanations when you answer." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="kente-strip" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" width={40} height={40} className="h-10 w-10" />
          <span className="font-display text-xl font-bold">Mwalimu Cloud</span>
        </div>
        <Button asChild variant="outline">
          <Link to="/chat">Sign in</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <section className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-4 inline-block rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              Habari! Your Azure study buddy
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.05] md:text-6xl">
              The cloud, explained like it's{" "}
              <span className="bg-sunset bg-clip-text text-transparent">from home.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Ask anything about Microsoft Azure. Get simple answers with real African examples, in English, Kiswahili
              or Sheng — then test yourself with exam-style questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-soft">
                <Link to="/chat">Start learning — it's free</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-soft">
            <div className="mb-4 ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              Elezea "elasticity" kwa Kiswahili 🙏
            </div>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                <strong>Elasticity</strong> ni uwezo wa cloud kuongeza au kupunguza rasilimali kulingana na mahitaji.
              </p>
              <p className="text-muted-foreground">
                🇰🇪 Fikiria M-Pesa siku ya mshahara — watu milioni wanatuma pesa kwa wakati mmoja. Azure inaongeza
                servers moja kwa moja, na kuzipunguza usiku watu wakilala.
              </p>
              <p className="rounded-lg bg-muted p-2 text-xs">
                💡 <strong>Exam tip:</strong> Elasticity = automatic. Scalability = ability to grow.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6">
              <f.icon className="h-6 w-6 text-accent" />
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
