import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analysisSchema = z.object({
  overallScore: z.number().int().min(0).max(100),

  scoreBreakdown: z.object({
    contentEvidence: z.number().int().min(0).max(25),
    roleAlignment: z.number().int().min(0).max(20),
    experienceQuality: z.number().int().min(0).max(15),
    skillsCredibility: z.number().int().min(0).max(10),
    projects: z.number().int().min(0).max(10),
    atsStructure: z.number().int().min(0).max(10),
    writingClarity: z.number().int().min(0).max(5),
    professionalPositioning: z.number().int().min(0).max(5),
  }),

  verdict: z.string(),

  overview: z.string(),

  recruiterImpression: z.object({
    firstImpression: z.string(),
    strongestSignal: z.string(),
    biggestConcern: z.string(),
  }),

  strengths: z.array(
    z.object({
      point: z.string(),
      evidence: z.string(),
      impact: z.string(),
    })
  ),

  weaknesses: z.array(
    z.object({
      issue: z.string(),
      evidence: z.string(),
      whyItMatters: z.string(),
      fix: z.string(),
    })
  ),

  skillsAnalysis: z.object({
    demonstrated: z.array(z.string()),
    claimedButWeaklySupported: z.array(z.string()),
    missingOrUnclear: z.array(z.string()),
  }),

  experienceAnalysis: z.object({
    quality: z.string(),
    strongestExperience: z.string(),
    weakestExperience: z.string(),
    improvements: z.array(z.string()),
  }),

  projectsAnalysis: z.object({
    quality: z.string(),
    strongestProject: z.string(),
    weaknesses: z.array(z.string()),
    improvements: z.array(z.string()),
  }),

  sectionFeedback: z.object({
    contact: z.string(),
    summary: z.string(),
    education: z.string(),
    experience: z.string(),
    projects: z.string(),
    skills: z.string(),
    certifications: z.string(),
    formatting: z.string(),
  }),

  atsAnalysis: z.object({
    score: z.number().int().min(0).max(100),
    strengths: z.array(z.string()),
    risks: z.array(z.string()),
  }),

  missingEvidence: z.array(z.string()),

  recommendations: z.array(
    z.object({
      priority: z.enum(["high", "medium", "low"]),
      recommendation: z.string(),
      reason: z.string(),
      action: z.string(),
    })
  ),
});

export type CVAnalysis = z.infer<typeof analysisSchema>;

const analysisJsonSchema = {
  type: "object",
  properties: {
    overallScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },

    scoreBreakdown: {
      type: "object",
      properties: {
        contentEvidence: { type: "integer" },
        roleAlignment: { type: "integer" },
        experienceQuality: { type: "integer" },
        skillsCredibility: { type: "integer" },
        projects: { type: "integer" },
        atsStructure: { type: "integer" },
        writingClarity: { type: "integer" },
        professionalPositioning: { type: "integer" },
      },
      required: [
        "contentEvidence",
        "roleAlignment",
        "experienceQuality",
        "skillsCredibility",
        "projects",
        "atsStructure",
        "writingClarity",
        "professionalPositioning",
      ],
    },

    verdict: { type: "string" },

    overview: { type: "string" },

    recruiterImpression: {
      type: "object",
      properties: {
        firstImpression: { type: "string" },
        strongestSignal: { type: "string" },
        biggestConcern: { type: "string" },
      },
      required: [
        "firstImpression",
        "strongestSignal",
        "biggestConcern",
      ],
    },

    strengths: {
      type: "array",
      items: {
        type: "object",
        properties: {
          point: { type: "string" },
          evidence: { type: "string" },
          impact: { type: "string" },
        },
        required: ["point", "evidence", "impact"],
      },
    },

    weaknesses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          issue: { type: "string" },
          evidence: { type: "string" },
          whyItMatters: { type: "string" },
          fix: { type: "string" },
        },
        required: ["issue", "evidence", "whyItMatters", "fix"],
      },
    },

    skillsAnalysis: {
      type: "object",
      properties: {
        demonstrated: {
          type: "array",
          items: { type: "string" },
        },
        claimedButWeaklySupported: {
          type: "array",
          items: { type: "string" },
        },
        missingOrUnclear: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: [
        "demonstrated",
        "claimedButWeaklySupported",
        "missingOrUnclear",
      ],
    },

    experienceAnalysis: {
      type: "object",
      properties: {
        quality: { type: "string" },
        strongestExperience: { type: "string" },
        weakestExperience: { type: "string" },
        improvements: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: [
        "quality",
        "strongestExperience",
        "weakestExperience",
        "improvements",
      ],
    },

    projectsAnalysis: {
      type: "object",
      properties: {
        quality: { type: "string" },
        strongestProject: { type: "string" },
        weaknesses: {
          type: "array",
          items: { type: "string" },
        },
        improvements: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: [
        "quality",
        "strongestProject",
        "weaknesses",
        "improvements",
      ],
    },

    sectionFeedback: {
      type: "object",
      properties: {
        contact: { type: "string" },
        summary: { type: "string" },
        education: { type: "string" },
        experience: { type: "string" },
        projects: { type: "string" },
        skills: { type: "string" },
        certifications: { type: "string" },
        formatting: { type: "string" },
      },
      required: [
        "contact",
        "summary",
        "education",
        "experience",
        "projects",
        "skills",
        "certifications",
        "formatting",
      ],
    },

    atsAnalysis: {
      type: "object",
      properties: {
        score: {
          type: "integer",
          minimum: 0,
          maximum: 100,
        },
        strengths: {
          type: "array",
          items: { type: "string" },
        },
        risks: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["score", "strengths", "risks"],
    },

    missingEvidence: {
      type: "array",
      items: { type: "string" },
    },

    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          priority: {
            type: "string",
            enum: ["high", "medium", "low"],
          },
          recommendation: { type: "string" },
          reason: { type: "string" },
          action: { type: "string" },
        },
        required: [
          "priority",
          "recommendation",
          "reason",
          "action",
        ],
      },
    },
  },

  required: [
    "overallScore",
    "scoreBreakdown",
    "verdict",
    "overview",
    "recruiterImpression",
    "strengths",
    "weaknesses",
    "skillsAnalysis",
    "experienceAnalysis",
    "projectsAnalysis",
    "sectionFeedback",
    "atsAnalysis",
    "missingEvidence",
    "recommendations",
  ],
};

export async function analyzeCVWithAI(
  cvText: string,
  targetRole?: string
): Promise<CVAnalysis> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  // Prevent unnecessarily huge API requests.
  const MAX_CV_CHARS = 30_000;

  const normalizedCV = cvText
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CV_CHARS);

  if (!normalizedCV) {
    throw new Error("No readable CV text was found.");
  }

  const roleContext = targetRole?.trim()
    ? `Target role: ${targetRole.trim()}`
    : "No target role was provided. Evaluate the CV against general professional standards.";

  const prompt = `
You are Hirely's professional CV evaluation engine.

Your job is NOT to summarize the CV.

Your job is to perform a rigorous recruiter-level audit of the candidate's CV and explain what is genuinely strong, weak, missing, unclear, or unconvincing.

${roleContext}

ANALYSIS STANDARD

Evaluate the CV as if you were a serious recruiter reviewing it for an actual hiring decision.

Be specific.
Be evidence-based.
Be critical.
Be fair.
Do not flatter the candidate.
Do not manufacture criticism simply to make the report look detailed.

GROUNDING RULES

1. Never invent facts about the candidate.
2. Never assume a skill is demonstrated merely because it appears in a skills list.
3. Distinguish between:
   - skills explicitly listed,
   - skills demonstrated through experience/projects,
   - skills claimed but poorly supported.
4. If evidence is missing, say that it is missing.
5. Do not infer employment achievements that are not stated.
6. Do not assume technologies were used professionally merely because they appear in a project.
7. When making a criticism, identify the evidence from the CV that caused the criticism.
8. If the CV does something well, explain WHY it is effective.
9. Avoid generic advice such as "add more details" unless you explain exactly what details are missing.
10. Do not penalize a candidate simply because a section is absent when that section is genuinely irrelevant to their experience.

RECRUITER TEST

Imagine you have approximately 15 seconds for the first scan.

Determine:
- What candidate profile does the CV communicate?
- What role does the candidate appear suited for?
- What is the strongest hiring signal?
- What is the biggest concern?
- Would the CV make you continue reading?
- What would make you reject or hesitate?

EVIDENCE TEST

For experience and projects, distinguish:

WEAK:
"Developed a web application."

STRONGER:
"Built a Next.js application used by 500+ users, reducing manual processing time by 30%."

Do not demand metrics where metrics would be unreasonable or unavailable, but identify when the CV makes impact impossible to judge.

EXPERIENCE TEST

Evaluate whether bullets communicate:
- action
- technical contribution
- ownership
- complexity
- scale
- outcome
- measurable impact where available

Identify responsibility-only bullets.

PROJECT TEST

Evaluate:
- technical depth
- problem complexity
- candidate ownership
- technologies used
- implementation evidence
- outcome
- originality
- relevance to the target role

SKILLS TEST

Do not treat a long skills list as evidence of competence.

Look for corroboration in:
- experience
- projects
- education
- certifications
- achievements

ATS TEST

Evaluate:
- standard section naming
- readable structure
- keyword relevance
- chronology
- excessive formatting risks
- tables/columns if evident from extracted text
- unclear headings
- missing role-relevant terminology

Do not claim that the CV will definitely fail an ATS. Identify potential risks instead.

SCORING

Score the CV using this rubric:

Content & Evidence: 25
Role Alignment: 20
Experience Quality: 15
Skills Credibility: 10
Projects: 10
ATS & Structure: 10
Writing & Clarity: 5
Professional Positioning: 5

The component scores MUST add up to the overall score.

RECOMMENDATIONS

Recommendations must be prioritized.

HIGH:
Changes that could materially improve hiring outcomes.

MEDIUM:
Meaningful improvements that strengthen the CV.

LOW:
Polish or optimization that is useful but not urgent.

Every recommendation must contain:
- what should change
- why it matters
- what the candidate should actually do

OUTPUT QUALITY

Write detailed analysis, but do not waste tokens repeating the same point in different sections.

Prefer:
"Your project section lists four technologies but gives almost no evidence of what you personally implemented. This makes the stack look like keyword stuffing rather than demonstrated ability."

Over:
"Your project section could be improved by adding more details."

CV TEXT:

---
${normalizedCV}
---
`;

  let response;
  let lastError: unknown;

  const MAX_ATTEMPTS = 3;
  const RETRY_DELAYS = [0, 2000, 5000];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (RETRY_DELAYS[attempt] > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAYS[attempt])
      );
    }

    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisJsonSchema,
        },
      });

      break;
    } catch (error) {
      lastError = error;

      const status =
        typeof error === "object" &&
        error !== null &&
        "status" in error
          ? (error as { status?: number }).status
          : undefined;

      const isRetryable =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (!isRetryable || attempt === MAX_ATTEMPTS - 1) {
        throw error;
      }

      console.warn(
        `Gemini request failed with status ${status}. Retrying... (${attempt + 1}/${MAX_ATTEMPTS})`
      );
    }
  }

  if (!response) {
    throw lastError ?? new Error("Gemini request failed.");
  }

  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  const parsed = JSON.parse(response.text);

  return analysisSchema.parse(parsed);
}