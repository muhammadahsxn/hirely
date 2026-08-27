import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const result = await auth.getSession();

  const authUser = result.data?.user;

  if (!authUser) {
    return null;
  }

  const user = await prisma.user.upsert({
    where: {
      authUserId: authUser.id,
    },
    update: {
      name: authUser.name,
      email: authUser.email,
    },
    create: {
      authUserId: authUser.id,
      name: authUser.name,
      email: authUser.email,
    },
  });

  return user;
}