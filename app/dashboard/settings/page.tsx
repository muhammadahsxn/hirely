import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";
import BackButton from "@/components/dashboard/BackButton";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <BackButton />

          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your Hirely preferences.
          </p>
        </header>

        {/* Appearance */}
        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Appearance
          </h2>

          <ThemeSelector />
        </section>

        {/* Your Data */}
        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Your Data
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage the CV analyses stored in your Hirely account.
          </p>

          <div className="mt-6">
            <a
              href="/dashboard/history"
              className="inline-flex rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Manage History
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}