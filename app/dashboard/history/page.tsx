import Link from "next/link";
import { getAnalysisHistory } from "./actions";
import DeleteButton from "./delete-button";

export default async function HistoryPage() {
  const analyses = await getAnalysisHistory();

  return (
    <main className="p-8">
      <div className="mx-auto max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold">
            Analysis History
          </h1>

          <p className="mt-2 text-muted-foreground">
            View your previous CV analyses.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {analyses.length === 0 ? (
            <div className="rounded-xl border p-8 text-center">
              <p className="font-medium">
                No analyses yet.
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Analyze your first CV to see it here.
              </p>

              <Link
                href="/dashboard/analyze"
                className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-primary-foreground"
              >
                Analyze CV
              </Link>
            </div>
          ) : (
            analyses.map((analysis) => {
              const isCompleted =
                analysis.status === "completed";

              const isFailed =
                analysis.status === "failed";

              return (
                <div
                  key={analysis.id}
                  className="rounded-xl border p-6"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                      <h2 className="font-semibold">
                        {analysis.cv.originalFilename}
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {analysis.targetRole
                          ? `Target role: ${analysis.targetRole}`
                          : "General CV analysis"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(
                          analysis.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {isCompleted && (
                        <>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Score
                            </p>

                            <p className="text-2xl font-bold">
                              {analysis.overallScore ?? "—"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/results/${analysis.id}`}
                              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                              View Analysis
                            </Link>
                            <DeleteButton analysisId={analysis.id} />
                          </div>
                        </>
                      )}

                      {analysis.status === "processing" && (
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600">
                          Processing
                        </span>
                      )}

                      {isFailed && (
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}