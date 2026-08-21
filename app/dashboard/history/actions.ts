"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function getAnalysisHistory() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  return prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    include: {
      cv: true,
      result: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteAnalysis(analysisId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      id: analysisId,
      userId: user.id,
    },
  });

  if (!analysis) {
    throw new Error("Analysis not found.");
  }

  await prisma.analysis.delete({
    where: {
      id: analysis.id,
    },
  });

  const remainingAnalyses = await prisma.analysis.count({
    where: {
      cvId: analysis.cvId,
    },
  });

  if (remainingAnalyses === 0) {
    await prisma.cV.deleteMany({
      where: {
        id: analysis.cvId,
        userId: user.id,
      },
    });
  }

  return {
    success: true,
  };
}