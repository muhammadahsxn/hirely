-- AlterTable
ALTER TABLE "AnalysisResult" ADD COLUMN     "atsAnalysis" JSONB,
ADD COLUMN     "experienceAnalysis" JSONB,
ADD COLUMN     "missingEvidence" JSONB,
ADD COLUMN     "overallScore" INTEGER,
ADD COLUMN     "projectsAnalysis" JSONB,
ADD COLUMN     "recruiterImpression" JSONB,
ADD COLUMN     "scoreBreakdown" JSONB,
ADD COLUMN     "verdict" TEXT;
