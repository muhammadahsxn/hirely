import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";
import BackButton from "@/components/dashboard/BackButton";
import DeleteAnalysisButton from "./DeleteAnalysisButton";

export const dynamic = "force-dynamic";

function getScoreLabel(score: number | null) {
  if (score === null) return "—";
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Needs work";
  return "Needs improvement";
}

function getScoreClass(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 70) return "text-success";
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

export default async function HistoryPage() {
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

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <BackButton />

        {/* Header */}
        <header className="mt-6">
          <p className="text-sm font-medium text-muted-foreground">
            Workspace
          </p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Analysis history
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Review and manage your previous CV analyses.
              </p>
            </div>

            <Link
              href="/dashboard/analyze"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Analyze CV
            </Link>
          </div>
        </header>

        {/* Summary */}
        <div className="mt-8 rounded-xl border bg-surface px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Total analyses
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {analyses.length}
          </p>
        </div>

        {/* History */}
        <section className="mt-6 overflow-hidden rounded-xl border bg-surface">
          {analyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-surface-muted">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5 text-muted-foreground"
                >
                  <path d="M7 3h8l4 4v14H7z" />
                  <path d="M15 3v5h5" />
                  <path d="M10 13h5M10 17h4" />
                </svg>
              </div>

              <h2 className="mt-4 font-semibold">
                No analyses yet
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Your completed CV analyses will appear here.
              </p>

              <Link
                href="/dashboard/analyze"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Analyze your first CV
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop header */}
              <div className="hidden grid-cols-[minmax(0,1fr)_120px_150px_44px] items-center gap-4 border-b bg-surface-muted px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                <span>CV</span>
                <span>Score</span>
                <span>Date</span>
                <span />
              </div>

              <div className="divide-y">
                {analyses.map((analysis) => {
                  const completed =
                    analysis.status === "completed";

                  return (
                    <div
                      key={analysis.id}
                      className="group grid gap-4 px-5 py-5 transition-colors hover:bg-surface-muted md:grid-cols-[minmax(0,1fr)_120px_150px_44px] md:items-center"
                    >
                      {/* CV */}
                      <Link
                        href={
                          completed
                            ? `/dashboard/results/${analysis.id}`
                            : "#"
                        }
                        className={
                          completed
                            ? "min-w-0"
                            : "min-w-0 cursor-default"
                        }
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-surface">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              className="h-4 w-4 text-muted-foreground"
                            >
                              <path d="M7 3h8l4 4v14H7z" />
                              <path d="M15 3v5h5" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {analysis.cv.originalFilename}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              {analysis.targetRole && (
                                <span>
                                  {analysis.targetRole}
                                </span>
                              )}

                              {analysis.targetRole && (
                                <span>•</span>
                              )}

                              <span>
                                {analysis.status ===
                                  "completed"
                                  ? "Completed"
                                  : analysis.status ===
                                    "processing"
                                    ? "Processing"
                                    : "Failed"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Score */}
                      <div>
                        <p
                          className={`text-lg font-semibold ${getScoreClass(
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

                      {/* Date */}
                      <div>
                        <p className="text-sm">
                          {formatDate(analysis.createdAt)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {analysis.status}
                        </p>
                      </div>

                      {/* Delete */}
                      <DeleteAnalysisButton
                        analysisId={analysis.id}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}