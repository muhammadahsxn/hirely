import Link from "next/link";

const features = [
  {
    title: "Recruiter perspective",
    description:
      "See how your CV is likely to be perceived before a recruiter ever sees it.",
  },
  {
    title: "Skill analysis",
    description:
      "Identify demonstrated skills, missing skills, and claims that need stronger evidence.",
  },
  {
    title: "Actionable feedback",
    description:
      "Get specific improvements instead of vague AI-generated advice.",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your CV",
    description:
      "Upload your existing CV and tell Hirely what role you're targeting.",
  },
  {
    number: "02",
    title: "Let AI analyze it",
    description:
      "Hirely evaluates your CV across content, skills, experience, projects, and recruiter impact.",
  },
  {
    number: "03",
    title: "Improve with clarity",
    description:
      "Get prioritized recommendations showing exactly what needs to change.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Public Topbar */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight transition-opacity hover:opacity-70"
          >
            Hirely
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in?redirect=/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Sign in
            </Link>

            <Link
              href="/auth/sign-up?redirect=/dashboard"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              AI-powered CV analysis
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Your CV should tell your story.
              <span className="block text-muted-foreground">
                Hirely tells you what's missing.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Upload your CV and get a recruiter-focused analysis
              covering strengths, weaknesses, skills, credibility,
              and the improvements that actually matter.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/sign-in?redirect=/dashboard/analyze"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg"
              >
                Analyze My CV
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex h-11 items-center justify-center rounded-lg border bg-surface px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Product Preview */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border bg-surface shadow-2xl">
              <div className="flex h-11 items-center gap-2 border-b px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              </div>

              <div className="grid min-h-[320px] md:grid-cols-[180px_1fr]">
                {/* Preview Sidebar */}
                <div className="hidden border-r p-4 md:block">
                  <div className="mb-6 text-sm font-bold">
                    Hirely
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
                      Dashboard
                    </div>

                    <div className="rounded-lg px-3 py-2 text-xs text-muted-foreground">
                      Analyze CV
                    </div>

                    <div className="rounded-lg px-3 py-2 text-xs text-muted-foreground">
                      History
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Analysis result
                      </p>

                      <h3 className="mt-1 text-lg font-semibold">
                        Your CV analysis
                      </h3>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full border text-sm font-bold">
                      82
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border p-4">
                      <p className="text-xs text-muted-foreground">
                        Strength
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        Strong technical foundation
                      </p>
                    </div>

                    <div className="rounded-xl border p-4">
                      <p className="text-xs text-muted-foreground">
                        Priority
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        Add measurable achievements
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">
                      AI recommendation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Strengthen your experience bullets with
                      measurable outcomes and evidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y bg-surface">
        <div className="mx-auto grid max-w-7xl divide-y px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="px-0 py-8 sm:px-8"
            >
              <h2 className="text-sm font-semibold">
                {feature.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">
            Simple by design
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            From CV to clarity in three steps.
          </h2>

          <p className="mt-4 text-muted-foreground">
            No complicated setup. Upload your CV, choose your
            target role, and let Hirely do the analysis.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-xs font-semibold text-muted-foreground">
                {step.number}
              </span>

              <h3 className="mt-5 text-lg font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:py-32">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Know exactly what to fix.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Stop guessing whether your CV is good enough. Let
            Hirely show you where it stands and what to do next.
          </p>

          <Link
            href="/auth/sign-in?redirect=/dashboard/analyze"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg"
          >
            Analyze My CV
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-foreground">
            Hirely
          </span>

          <span>
            AI-powered CV analysis.
          </span>
        </div>
      </footer>
    </main>
  );
}