import { getCurrentUser } from "@/lib/auth/current-user";
import { notFound } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your Hirely account and preferences.
          </p>
        </header>

        {/* Account */}
        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Account
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-medium">
                {user.name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Email
              </p>

              <p className="mt-1 font-medium">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Analysis Preferences */}
        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Analysis Preferences
          </h2>

          <div className="mt-6">
            <div>
              <p className="font-medium">
                Target role
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                You can specify a target role every time you analyze
                a CV. Default-role preferences will be added later.
              </p>
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Your Data
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage the CV analyses stored in your Hirely account.
          </p>

          <div className="mt-6">
            <p className="text-sm">
              Individual analyses can be removed from the{" "}
              <span className="font-medium">
                History
              </span>{" "}
              page.
            </p>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-red-500/30 p-6">
          <h2 className="text-xl font-semibold text-red-500">
            Danger Zone
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            These actions are permanent and cannot be undone.
          </p>

          <div className="mt-6">
            <button
              type="button"
              disabled
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-500 opacity-50"
            >
              Delete Account
            </button>

            <p className="mt-2 text-xs text-muted-foreground">
              Account deletion will be available in a later version.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}