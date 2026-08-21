"use client";

import { useState } from "react";
import { analyzeCV } from "./actions";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit() {
    if (!file || loading) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      if (targetRole.trim()) {
        formData.append("targetRole", targetRole.trim());
      }

      const data = await analyzeCV(formData);

      if (data.success) {
        router.push(`/dashboard/results/${data.analysisId}`);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">
          Analyze your CV
        </h1>

        <p className="mt-2 text-muted-foreground">
          Upload your CV and get a detailed recruiter-level AI analysis.
        </p>

        <div className="mt-8 rounded-xl border p-8">
          <label className="block text-sm font-medium">
            CV / Resume
          </label>

          <input
            type="file"
            accept=".pdf,.docx"
            disabled={loading}
            className="mt-3 block w-full rounded-lg border p-3 disabled:opacity-50"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setError("");
            }}
          />

          {file && (
            <p className="mt-3 text-sm text-muted-foreground">
              Selected: {file.name}
            </p>
          )}

          <div className="mt-6">
            <label
              htmlFor="targetRole"
              className="block text-sm font-medium"
            >
              Target Role
              <span className="ml-2 font-normal text-muted-foreground">
                Optional
              </span>
            </label>

            <input
              id="targetRole"
              type="text"
              value={targetRole}
              disabled={loading}
              onChange={(event) => {
                setTargetRole(event.target.value);
                setError("");
              }}
              placeholder="e.g. Frontend Developer, Software Engineer"
              className="mt-3 block w-full rounded-lg border bg-background p-3 outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Providing a target role lets Hirely evaluate how well your CV
              matches that specific position.
            </p>
          </div>

          <button
            type="button"
            disabled={!file || loading}
            onClick={handleSubmit}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing CV..." : "Analyze CV"}
          </button>

          {loading && (
            <div className="mt-5 rounded-lg bg-muted p-4">
              <p className="font-medium">
                Analyzing your CV...
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Hirely is reviewing your experience, skills, projects,
                ATS structure, and fit for your target role.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-500">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}