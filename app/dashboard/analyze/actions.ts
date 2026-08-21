"use server";

import { extractText } from "@/lib/cv/extract";
import { analyzeCVWithAI } from "@/lib/ai/analyze-cv";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";

export async function analyzeCV(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("No CV file was provided.");
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const maxFileSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Unsupported file type. Please upload a PDF or DOCX file."
    );
  }

  if (file.size > maxFileSize) {
    throw new Error(
      "File is too large. Maximum file size is 5 MB."
    );
  }

  const targetRoleValue = formData.get("targetRole");

  const targetRole =
    typeof targetRoleValue === "string" &&
    targetRoleValue.trim()
      ? targetRoleValue.trim()
      : undefined;

  if (
    file.type !== "application/pdf" &&
    file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    throw new Error(
      "Unsupported file type. Please upload a PDF or DOCX file."
    );
  }

  let cvId: string | null = null;
  let analysisId: string | null = null;

  try {
    /*
     * 1. Extract CV text
     */
    const extractedText = await extractText(file);

    if (!extractedText.trim()) {
      throw new Error(
        "Could not extract readable text from the CV."
      );
    }

    /*
     * 2. Create CV record
     */
    const cv = await prisma.cV.create({
      data: {
        userId: user.id,
        originalFilename: file.name,
        fileLocation: "",
        fileType: file.type,
        extractedText,
      },
    });

    cvId = cv.id;

    /*
     * 3. Create analysis record
     */
    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        cvId: cv.id,
        targetRole,
        status: "processing",
      },
    });

    analysisId = analysis.id;

    /*
     * 4. Run AI analysis
     */
    const result = await analyzeCVWithAI(
      extractedText,
      targetRole
    );

    /*
     * 5. Save complete AI result
     */
    await prisma.analysisResult.create({
      data: {
        analysisId: analysis.id,

        overview: result.overview,

        strengths: result.strengths,

        weaknesses: result.weaknesses,

        skillsAnalysis: result.skillsAnalysis,

        sectionFeedback: result.sectionFeedback,

        recommendations: result.recommendations,

        /*
         * These fields are part of the expanded analysis.
         */
        verdict: result.verdict,

        recruiterImpression:
          result.recruiterImpression,
      },
    });

    /*
     * 6. Mark analysis complete
     */
    await prisma.analysis.update({
      where: {
        id: analysis.id,
      },

      data: {
        overallScore: result.overallScore,
        status: "completed",
      },
    });

    /*
     * 7. Return result ID
     */
    return {
      success: true,
      analysisId: analysis.id,
    };
  } catch (error) {
    console.error(
      "CV analysis failed:",
      error
    );

    /*
     * Remove incomplete records so failed
     * attempts don't appear in History.
     */
    if (analysisId) {
      try {
        await prisma.analysis.delete({
          where: {
            id: analysisId,
          },
        });
      } catch (cleanupError) {
        console.error(
          "Failed to clean up analysis:",
          cleanupError
        );
      }
    }

    if (cvId) {
      try {
        await prisma.cV.delete({
          where: {
            id: cvId,
          },
        });
      } catch (cleanupError) {
        console.error(
          "Failed to clean up CV:",
          cleanupError
        );
      }
    }

    if (
      error instanceof Error &&
      error.message !== "CV analysis failed."
    ) {
      throw error;
    }

    throw new Error(
      "CV analysis failed. Please try again."
    );
  }
}