import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";

type RecruiterImpression = {
  firstImpression: string;
  strongestSignal: string;
  biggestConcern: string;
};

type SkillsAnalysis = {
  demonstrated: string[];
  claimedButWeaklySupported: string[];
  missingOrUnclear: string[];
};

type Strength = {
  point: string;
  evidence: string;
  impact: string;
};

type Weakness = {
  issue: string;
  evidence: string;
  whyItMatters: string;
  fix: string;
};

type Recommendation = {
  priority: "high" | "medium" | "low";
  recommendation: string;
  reason: string;
  action: string;
};

type AnalysisResult = {
  verdict: string | null;
  overview: string | null;

  recruiterImpression: RecruiterImpression | null;

  strengths: Strength[];

  weaknesses: Weakness[];

  skillsAnalysis: SkillsAnalysis | null;

  recommendations: Recommendation[];
};

type ResultsPageProps = {
  params: Promise<{
    analysisId: string;
  }>;
};

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function parseRecruiterImpression(
  value: unknown
): RecruiterImpression | null {
  if (!isObject(value)) {
    return null;
  }

  return {
    firstImpression:
      typeof value.firstImpression === "string"
        ? value.firstImpression
        : "",

    strongestSignal:
      typeof value.strongestSignal === "string"
        ? value.strongestSignal
        : "",

    biggestConcern:
      typeof value.biggestConcern === "string"
        ? value.biggestConcern
        : "",
  };
}

function parseSkillsAnalysis(
  value: unknown
): SkillsAnalysis {
  if (!isObject(value)) {
    return {
      demonstrated: [],
      claimedButWeaklySupported: [],
      missingOrUnclear: [],
    };
  }

  return {
    demonstrated: Array.isArray(value.demonstrated)
      ? value.demonstrated.filter(
          (item): item is string =>
            typeof item === "string"
        )
      : [],

    claimedButWeaklySupported: Array.isArray(
      value.claimedButWeaklySupported
    )
      ? value.claimedButWeaklySupported.filter(
          (item): item is string =>
            typeof item === "string"
        )
      : [],

    missingOrUnclear: Array.isArray(
      value.missingOrUnclear
    )
      ? value.missingOrUnclear.filter(
          (item): item is string =>
            typeof item === "string"
        )
      : [],
  };
}

function parseStrengths(
  value: unknown
): Strength[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item): Strength => ({
      point:
        typeof item.point === "string"
          ? item.point
          : "",

      evidence:
        typeof item.evidence === "string"
          ? item.evidence
          : "",

      impact:
        typeof item.impact === "string"
          ? item.impact
          : "",
    }));
}

function parseWeaknesses(
  value: unknown
): Weakness[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item): Weakness => ({
      issue:
        typeof item.issue === "string"
          ? item.issue
          : "",

      evidence:
        typeof item.evidence === "string"
          ? item.evidence
          : "",

      whyItMatters:
        typeof item.whyItMatters === "string"
          ? item.whyItMatters
          : "",

      fix:
        typeof item.fix === "string"
          ? item.fix
          : "",
    }));
}

function parseRecommendations(
  value: unknown
): Recommendation[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item): Recommendation => {
      const priority =
        typeof item.priority === "string"
          ? item.priority
          : "low";

      return {
        priority:
          priority === "high" ||
          priority === "medium" ||
          priority === "low"
            ? priority
            : "low",

        recommendation:
          typeof item.recommendation === "string"
            ? item.recommendation
            : "",

        reason:
          typeof item.reason === "string"
            ? item.reason
            : "",

        action:
          typeof item.action === "string"
            ? item.action
            : "",
      };
    });
}

function normalizeResult(
  raw: {
    verdict: string | null;
    overview: string | null;
    recruiterImpression: unknown;
    strengths: unknown;
    weaknesses: unknown;
    skillsAnalysis: unknown;
    recommendations: unknown;
  }
): AnalysisResult {
  return {
    verdict: raw.verdict,
    overview: raw.overview,

    recruiterImpression: parseRecruiterImpression(
      raw.recruiterImpression
    ),

    strengths: parseStrengths(raw.strengths),

    weaknesses: parseWeaknesses(raw.weaknesses),

    skillsAnalysis: parseSkillsAnalysis(
      raw.skillsAnalysis
    ),

    recommendations: parseRecommendations(
      raw.recommendations
    ),
  };
}

export default async function ResultsPage({
  params,
}: ResultsPageProps) {
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

  if (!analysis || !analysis.result) {
    notFound();
  }

  /*
   * Prisma correctly types JSON database fields as JsonValue.
   * We normalize them once here instead of fighting TypeScript
   * throughout the JSX.
   */
  const rawResult = analysis.result;

  const result = normalizeResult({
    verdict: rawResult.verdict,
    overview: rawResult.overview,
    recruiterImpression:
      rawResult.recruiterImpression,
    strengths: rawResult.strengths,
    weaknesses: rawResult.weaknesses,
    skillsAnalysis: rawResult.skillsAnalysis,
    recommendations: rawResult.recommendations,
  });

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* HEADER */}
        <header>
          <p className="text-sm text-muted-foreground">
            CV Analysis
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {analysis.cv.originalFilename}
          </h1>

          {analysis.targetRole && (
            <p className="mt-2 text-muted-foreground">
              Target role: {analysis.targetRole}
            </p>
          )}
        </header>

        {/* OVERVIEW */}
        <section className="rounded-2xl border p-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Overall Score
              </p>

              <p className="mt-2 text-6xl font-bold">
                {analysis.overallScore ?? "—"}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                out of 100
              </p>
            </div>

            <div className="max-w-xl">
              <p className="text-lg font-semibold">
                {result.verdict ?? "Analysis complete"}
              </p>

              <p className="mt-3 leading-7 text-muted-foreground">
                {result.overview ??
                  "No overview available."}
              </p>
            </div>
          </div>
        </section>

        {/* RECRUITER IMPRESSION */}
        <section className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">
            Recruiter Impression
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            <div>
              <h3 className="font-medium">
                First Impression
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {result.recruiterImpression
                  ?.firstImpression ||
                  "No recruiter impression available."}
              </p>
            </div>

            <div>
              <h3 className="font-medium">
                Strongest Signal
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {result.recruiterImpression
                  ?.strongestSignal ||
                  "No strongest signal available."}
              </p>
            </div>

            <div>
              <h3 className="font-medium">
                Biggest Concern
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {result.recruiterImpression
                  ?.biggestConcern ||
                  "No major concern identified."}
              </p>
            </div>

          </div>
        </section>

        {/* STRENGTHS */}
        <section className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">
            Strengths
          </h2>

          <div className="mt-6 space-y-6">
            {result.strengths.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No strengths were identified.
              </p>
            ) : (
              result.strengths.map(
                (item, index) => (
                  <div
                    key={index}
                    className="border-l-2 pl-5"
                  >
                    <h3 className="font-medium">
                      {item.point}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Evidence:</strong>{" "}
                      {item.evidence}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      <strong>
                        Why it matters:
                      </strong>{" "}
                      {item.impact}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        </section>

        {/* WEAKNESSES */}
        <section className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">
            Weaknesses
          </h2>

          <div className="mt-6 space-y-6">
            {result.weaknesses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No major weaknesses were identified.
              </p>
            ) : (
              result.weaknesses.map(
                (item, index) => (
                  <div
                    key={index}
                    className="border-l-2 pl-5"
                  >
                    <h3 className="font-medium">
                      {item.issue}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Evidence:</strong>{" "}
                      {item.evidence}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      <strong>
                        Why it matters:
                      </strong>{" "}
                      {item.whyItMatters}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      <strong>Fix:</strong>{" "}
                      {item.fix}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        </section>

        {/* SKILLS */}
        <section className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">
            Skills Analysis
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            {/* Demonstrated */}
            <div>
              <h3 className="font-medium">
                Demonstrated
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {result.skillsAnalysis
                  ?.demonstrated.length ? (
                  result.skillsAnalysis.demonstrated.map(
                    (skill, index) => (
                      <li key={index}>
                        • {skill}
                      </li>
                    )
                  )
                ) : (
                  <li>
                    No demonstrated skills identified.
                  </li>
                )}
              </ul>
            </div>

            {/* Weakly Supported */}
            <div>
              <h3 className="font-medium">
                Weakly Supported
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {result.skillsAnalysis
                  ?.claimedButWeaklySupported.length ? (
                  result.skillsAnalysis.claimedButWeaklySupported.map(
                    (skill, index) => (
                      <li key={index}>
                        • {skill}
                      </li>
                    )
                  )
                ) : (
                  <li>
                    No weakly supported skills identified.
                  </li>
                )}
              </ul>
            </div>

            {/* Missing / Unclear */}
            <div>
              <h3 className="font-medium">
                Missing / Unclear
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {result.skillsAnalysis
                  ?.missingOrUnclear.length ? (
                  result.skillsAnalysis.missingOrUnclear.map(
                    (skill, index) => (
                      <li key={index}>
                        • {skill}
                      </li>
                    )
                  )
                ) : (
                  <li>
                    No missing or unclear skills identified.
                  </li>
                )}
              </ul>
            </div>

          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="rounded-2xl border p-8">
          <h2 className="text-2xl font-semibold">
            Recommendations
          </h2>

          <div className="mt-6 space-y-5">
            {result.recommendations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recommendations available.
              </p>
            ) : (
              result.recommendations.map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase">
                        {item.priority}
                      </span>

                      <h3 className="font-medium">
                        {item.recommendation}
                      </h3>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {item.reason}
                    </p>

                    <p className="mt-2 text-sm">
                      <strong>Action:</strong>{" "}
                      {item.action}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        </section>

      </div>
    </main>
  );
}