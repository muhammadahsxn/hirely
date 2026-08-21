import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import BackButton from "@/components/dashboard/BackButton";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function asObject(
  value: unknown
): Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string =>
      typeof item === "string"
  );
}

function getScoreLabel(score: number | null) {
  if (score === null) return "Not scored";
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

function priorityClass(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-danger/10 text-danger";

    case "medium":
      return "bg-warning/10 text-warning";

    default:
      return "bg-surface-muted text-muted-foreground";
  }
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      id: analysisId,
      userId: user.id,
    },
    include: {
      cv: true,
      result: true,
    },
  });

  if (!analysis) {
    notFound();
  }

  if (analysis.status !== "completed") {
    return (
      <div className="p-6 sm:p-8">
        <div className="mx-auto max-w-3xl">
          <BackButton />

          <div className="mt-8 rounded-xl border bg-surface p-8 text-center">
            <h1 className="text-xl font-semibold">
              Analysis not completed
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              This analysis is currently{" "}
              {analysis.status}.
            </p>

            <Link
              href="/dashboard/history"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Back to history
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const result = analysis.result;

  if (!result) {
    notFound();
  }

  const recruiter =
    asObject(result.recruiterImpression);

  const skills =
    asObject(result.skillsAnalysis);

  const sectionFeedback =
    asObject(result.sectionFeedback);

  const strengths =
    Array.isArray(result.strengths)
      ? result.strengths
      : [];

  const weaknesses =
    Array.isArray(result.weaknesses)
      ? result.weaknesses
      : [];

  const recommendations =
    Array.isArray(result.recommendations)
      ? result.recommendations
      : [];

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <BackButton />

        {/* Header */}
        <header className="mt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Analysis result
              </p>

              <h1 className="mt-1 truncate text-3xl font-semibold tracking-tight">
                {analysis.cv.originalFilename}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {formatDate(analysis.createdAt)}
                </span>

                {analysis.targetRole && (
                  <>
                    <span>•</span>

                    <span>
                      Target: {analysis.targetRole}
                    </span>
                  </>
                )}
              </div>
            </div>

            <Link
              href="/dashboard/analyze"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border bg-surface px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Analyze another CV
            </Link>
          </div>
        </header>

        {/* Score + Verdict */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center justify-center rounded-xl border bg-surface p-8 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Overall score
            </p>

            <p
              className={`mt-3 text-6xl font-bold tracking-tight ${getScoreClass(
                analysis.overallScore
              )}`}
            >
              {analysis.overallScore ?? "—"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              out of 100
            </p>

            <p
              className={`mt-4 text-sm font-semibold ${getScoreClass(
                analysis.overallScore
              )}`}
            >
              {getScoreLabel(analysis.overallScore)}
            </p>
          </div>

          <div className="rounded-xl border bg-surface p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              AI verdict
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {result.verdict ||
                "No verdict available"}
            </h2>

            {result.overview && (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                {result.overview}
              </p>
            )}
          </div>
        </section>

        {/* Recruiter impression */}
        <section className="mt-6 rounded-xl border bg-surface p-6 sm:p-8">
          <div>
            <h2 className="text-xl font-semibold">
              Recruiter impression
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              How your CV is likely to be perceived at first glance.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InsightCard
              label="First impression"
              value={asString(
                recruiter.firstImpression
              )}
            />

            <InsightCard
              label="Strongest signal"
              value={asString(
                recruiter.strongestSignal
              )}
            />

            <InsightCard
              label="Biggest concern"
              value={asString(
                recruiter.biggestConcern
              )}
              danger
            />
          </div>
        </section>

        {/* Strengths + weaknesses */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border bg-surface p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                ✓
              </div>

              <div>
                <h2 className="font-semibold">
                  Strengths
                </h2>

                <p className="text-sm text-muted-foreground">
                  What's working in your favor.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {strengths.length > 0 ? (
                strengths.map((item, index) => {
                  const strength =
                    asObject(item);

                  return (
                    <div
                      key={index}
                      className="rounded-lg border bg-surface-muted p-4"
                    >
                      <h3 className="text-sm font-semibold">
                        {asString(
                          strength.point
                        ) || "Strength"}
                      </h3>

                      {asString(
                        strength.impact
                      ) && (
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {asString(
                              strength.impact
                            )}
                          </p>
                        )}

                      {asString(
                        strength.evidence
                      ) && (
                          <p className="mt-3 border-l-2 pl-3 text-xs leading-5 text-muted-foreground">
                            {asString(
                              strength.evidence
                            )}
                          </p>
                        )}
                    </div>
                  );
                })
              ) : (
                <EmptyState text="No strengths were returned." />
              )}
            </div>
          </section>

          <section className="rounded-xl border bg-surface p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger/10 text-danger">
                !
              </div>

              <div>
                <h2 className="font-semibold">
                  Areas to improve
                </h2>

                <p className="text-sm text-muted-foreground">
                  Issues reducing your CV's impact.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {weaknesses.length > 0 ? (
                weaknesses.map((item, index) => {
                  const weakness =
                    asObject(item);

                  return (
                    <div
                      key={index}
                      className="rounded-lg border bg-surface-muted p-4"
                    >
                      <h3 className="text-sm font-semibold">
                        {asString(
                          weakness.issue
                        ) || "Issue"}
                      </h3>

                      {asString(
                        weakness.whyItMatters
                      ) && (
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {asString(
                              weakness.whyItMatters
                            )}
                          </p>
                        )}

                      {asString(
                        weakness.fix
                      ) && (
                          <div className="mt-3 rounded-md bg-surface p-3 text-xs leading-5">
                            <span className="font-semibold">
                              Fix:{" "}
                            </span>

                            {asString(
                              weakness.fix
                            )}
                          </div>
                        )}
                    </div>
                  );
                })
              ) : (
                <EmptyState text="No weaknesses were returned." />
              )}
            </div>
          </section>
        </div>

        {/* Skills */}
        <section className="mt-6 rounded-xl border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            Skills analysis
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            What your CV demonstrates, misses, or claims without enough evidence.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <SkillGroup
              title="Demonstrated"
              items={asStringArray(
                skills.demonstrated
              )}
            />

            <SkillGroup
              title="Missing or unclear"
              items={asStringArray(
                skills.missingOrUnclear
              )}
            />

            <SkillGroup
              title="Weakly supported"
              items={asStringArray(
                skills.claimedButWeaklySupported
              )}
            />
          </div>
        </section>

        {/* Section feedback */}
        <section className="mt-6 rounded-xl border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            Section feedback
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Detailed feedback across your CV sections.
          </p>

          <div className="mt-6 divide-y">
            {Object.entries(sectionFeedback).map(
              ([section, feedback]) => (
                <div
                  key={section}
                  className="grid gap-2 py-4 md:grid-cols-[160px_1fr]"
                >
                  <p className="text-sm font-medium capitalize">
                    {section}
                  </p>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {typeof feedback === "string"
                      ? feedback
                      : JSON.stringify(feedback)}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Future analysis modules */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <UnavailableModule
            title="ATS analysis"
            description="Keyword matching and ATS compatibility will appear here."
            available={Boolean(result.atsAnalysis)}
          />

          <UnavailableModule
            title="Experience analysis"
            description="Detailed experience quality analysis will appear here."
            available={Boolean(
              result.experienceAnalysis
            )}
          />

          <UnavailableModule
            title="Project analysis"
            description="Project quality and impact analysis will appear here."
            available={Boolean(
              result.projectsAnalysis
            )}
          />
        </div>

        {/* Recommendations */}
        <section className="mt-6 rounded-xl border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            Recommended actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Prioritized changes that can improve your CV.
          </p>

          <div className="mt-6 space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map(
                (item, index) => {
                  const recommendation =
                    asObject(item);

                  const priority =
                    asString(
                      recommendation.priority
                    ) || "low";

                  return (
                    <div
                      key={index}
                      className="rounded-xl border bg-surface-muted p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold">
                            {index + 1}
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold">
                              {asString(
                                recommendation.action
                              ) ||
                                "Recommended action"}
                            </h3>

                            {asString(
                              recommendation.recommendation
                            ) && (
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                  {asString(
                                    recommendation.recommendation
                                  )}
                                </p>
                              )}

                            {asString(
                              recommendation.reason
                            ) && (
                                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                  {asString(
                                    recommendation.reason
                                  )}
                                </p>
                              )}
                          </div>
                        </div>

                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${priorityClass(
                            priority
                          )}`}
                        >
                          {priority}
                        </span>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <EmptyState text="No recommendations were returned." />
            )}
          </div>
        </section>

        {/* Bottom actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/analyze"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Analyze another CV
          </Link>

          <Link
            href="/dashboard/history"
            className="inline-flex h-11 items-center justify-center rounded-lg border bg-surface px-5 text-sm font-medium transition-colors hover:bg-accent"
          >
            View history
          </Link>
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string | null;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${danger
        ? "border-danger/20 bg-danger/5"
        : "bg-surface-muted"
        }`}
    >
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6">
        {value || "Not available."}
      </p>
    </div>
  );
}

function SkillGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-lg border bg-surface-muted px-3 py-1.5 text-xs"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            None identified.
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function UnavailableModule({
  title,
  description,
  available,
}: {
  title: string;
  description: string;
  available: boolean;
}) {
  return (
    <section className="rounded-xl border bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>

        <span className="rounded-full bg-surface-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {available ? "Available" : "Coming soon"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}