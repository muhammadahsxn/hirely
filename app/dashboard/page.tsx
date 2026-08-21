import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
export const dynamic = "force-dynamic";

function getScoreLabel(score: number | null) {
  if (score === null) return "Not scored";
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Needs work";
  return "Needs improvement";
}

function getScoreVariant(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 85) return "text-success";
  if (score >= 70) return "text-foreground";
  if (score >= 55) return "text-warning";
  return "text-danger";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    include: {
      cv: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const completedAnalyses = analyses.filter(
    (analysis) => analysis.status === "completed"
  );

  const scoredAnalyses = completedAnalyses.filter(
    (analysis) => analysis.overallScore !== null
  );

  const averageScore =
    scoredAnalyses.length > 0
      ? Math.round(
          scoredAnalyses.reduce(
            (sum, analysis) =>
              sum + (analysis.overallScore ?? 0),
            0
          ) / scoredAnalyses.length
        )
      : null;

  const recentAnalyses = analyses.slice(0, 5);

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Welcome back{user.name ? `, ${user.name}` : ""}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Review your CV performance and start a new analysis
              whenever you're ready.
            </p>
          </div>

          <Link
            href="/dashboard/analyze"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-150 hover:opacity-90"
          >
            Analyze CV
          </Link>
        </header>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-surface p-5">
            <p className="text-sm text-muted-foreground">
              Total analyses
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {analyses.length}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              CV analyses created
            </p>
          </div>

          <div className="rounded-xl border bg-surface p-5">
            <p className="text-sm text-muted-foreground">
              Completed
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {completedAnalyses.length}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Successfully analyzed
            </p>
          </div>

          <div className="rounded-xl border bg-surface p-5">
            <p className="text-sm text-muted-foreground">
              Average score
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {averageScore ?? "—"}
              {averageScore !== null && (
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  / 100
                </span>
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Across completed analyses
            </p>
          </div>
        </section>

        {/* Recent analyses */}
        <section className="rounded-xl border bg-surface">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Recent analyses
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Your latest CV analysis activity
              </p>
            </div>

            {analyses.length > 0 && (
              <Link
                href="/dashboard/history"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View history
              </Link>
            )}
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-surface-muted text-muted-foreground">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M7 3h8l4 4v14H7z" />
                  <path d="M15 3v5h5" />
                  <path d="M10 13h5M10 17h5" />
                </svg>
              </div>

              <h3 className="mt-4 font-semibold">
                No analyses yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Upload your first CV and let Hirely analyze
                how effectively it presents your experience.
              </p>

              <Link
                href="/dashboard/analyze"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Analyze your first CV
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={
                    analysis.status === "completed"
                      ? `/dashboard/results/${analysis.id}`
                      : "/dashboard/history"
                  }
                  className="flex items-center justify-between gap-5 px-5 py-4 transition-colors hover:bg-surface-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {analysis.cv.originalFilename}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {formatDate(analysis.createdAt)}
                      </span>

                      {analysis.targetRole && (
                        <>
                          <span>•</span>
                          <span>{analysis.targetRole}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    {analysis.status === "completed" ? (
                      <div className="text-right">
                        <p
                          className={`text-lg font-semibold ${getScoreVariant(
                            analysis.overallScore
                          )}`}
                        >
                          {analysis.overallScore ?? "—"}
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                          {getScoreLabel(
                            analysis.overallScore
                          )}
                        </p>
                      </div>
                    ) : analysis.status === "processing" ? (
                      <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                        Processing
                      </span>
                    ) : (
                      <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                        Failed
                      </span>
                    )}

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        {analyses.length > 0 && (
          <section className="rounded-xl border bg-surface-muted p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Ready to improve your CV?
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                  Run another analysis to see what you can
                  improve for your target role.
                </p>
              </div>

              <Link
                href="/dashboard/analyze"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border bg-surface px-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                Analyze another CV
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}