import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const result = await auth.getSession();

  const authUser = result.data?.user;

  if (!authUser) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      authUserId: authUser.id,
    },
  });
}