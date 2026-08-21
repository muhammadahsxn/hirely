import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { notFound } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
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
    take: 5,
  });

  const completedAnalyses = analyses.filter(
    (analysis) => analysis.status === "completed"
  );

  const totalAnalyses = await prisma.analysis.count({
    where: {
      userId: user.id,
    },
  });

  const completedCount = await prisma.analysis.count({
    where: {
      userId: user.id,
      status: "completed",
    },
  });

  const averageScore = await prisma.analysis.aggregate({
    where: {
      userId: user.id,
      status: "completed",
      overallScore: {
        not: null,
      },
    },
    _avg: {
      overallScore: true,
    },
  });

  const avgScore = averageScore._avg.overallScore
    ? Math.round(averageScore._avg.overallScore)
    : null;

  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header>
          <p className="text-sm text-muted-foreground">
            Welcome back
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            {user.name || "There"}
          </h1>

          <p className="mt-2 text-muted-foreground">
            Analyze your CV and see exactly how recruiters may perceive it.
          </p>
        </header>

        {/* Primary CTA */}
        <section className="rounded-2xl border p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">
                Ready to improve your CV?
              </h2>

              <p className="mt-2 max-w-xl text-muted-foreground">
                Get a detailed analysis of your experience, projects,
                skills, ATS structure, and recruiter impact.
              </p>
            </div>

            <Link
              href="/dashboard/analyze"
              className="shrink-0 rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground"
            >
              Analyze CV
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">
              Total Analyses
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalAnalyses}
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold">
              {completedCount}
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">
              Average Score
            </p>

            <p className="mt-2 text-3xl font-bold">
              {avgScore ?? "—"}
            </p>
          </div>
        </section>

        {/* Recent analyses */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Recent Analyses
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your latest CV evaluations.
              </p>
            </div>

            {analyses.length > 0 && (
              <Link
                href="/dashboard/history"
                className="text-sm font-medium hover:underline"
              >
                View all
              </Link>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {analyses.length === 0 ? (
              <div className="rounded-xl border p-8 text-center">
                <p className="font-medium">
                  No analyses yet.
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Upload your first CV to get started.
                </p>
              </div>
            ) : (
              analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="font-medium">
                        {analysis.cv.originalFilename}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {analysis.targetRole
                          ? analysis.targetRole
                          : "General analysis"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(
                          analysis.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {analysis.status === "completed" && (
                        <>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Score
                            </p>

                            <p className="text-2xl font-bold">
                              {analysis.overallScore ?? "—"}
                            </p>
                          </div>

                          <Link
                            href={`/dashboard/results/${analysis.id}`}
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                          >
                            View
                          </Link>
                        </>
                      )}

                      {analysis.status === "processing" && (
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600">
                          Processing
                        </span>
                      )}

                      {analysis.status === "failed" && (
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}