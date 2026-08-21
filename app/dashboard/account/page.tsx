import { notFound } from "next/navigation";

import BackButton from "@/components/dashboard/BackButton";
import { getCurrentUser } from "@/lib/auth/current-user";
import { signOut } from "./actions";
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const memberSince = user.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <BackButton />

        <header>
          <h1 className="text-3xl font-bold">Account</h1>

          <p className="mt-2 text-muted-foreground">
            Manage your Hirely account information.
          </p>
        </header>

        <div className="mt-8 space-y-6">
          {/* Profile */}
          <section className="rounded-xl border p-6">
            <h2 className="text-lg font-semibold">
              Profile
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your personal information associated with Hirely.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-medium">
                  Name
                </p>

                <div className="mt-2 rounded-lg border bg-muted/30 px-4 py-3">
                  <p className="text-sm">
                    {user.name || "No name set"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">
                  Email
                </p>

                <div className="mt-2 rounded-lg border bg-muted/30 px-4 py-3">
                  <p className="text-sm">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Account Details */}
          <section className="rounded-xl border p-6">
            <h2 className="text-lg font-semibold">
              Account Details
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Information about your Hirely account.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Member since
                </p>

                <p className="mt-1 font-medium">
                  {memberSince}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Account status
                </p>

                <p className="mt-1 font-medium">
                  Active
                </p>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-xl border p-6">
            <h2 className="text-lg font-semibold">
              Security
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your current session.
            </p>

            <div className="mt-6">
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Sign out
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}