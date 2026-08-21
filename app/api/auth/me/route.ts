import { auth } from "@/lib/auth/server";

export async function GET() {
  const result = await auth.getSession();

  return Response.json({
    user: result.data?.user ?? null,
  });
}