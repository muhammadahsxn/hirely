"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeCV } from "./actions";

export default function AnalyzePage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleSubmit() {
    if (!file || isAnalyzing) return;

    setError("");
    setIsAnalyzing(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      if (targetRole.trim()) {
        formData.append("targetRole", targetRole.trim());
      }

      const data = await analyzeCV(formData);

      if (data.success) {
        router.push(
          `/dashboard/results/${data.analysisId}`
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setIsAnalyzing(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header>
          <p className="text-sm font-medium text-muted-foreground">
            Analyze CV
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Analyze your CV
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Upload your CV and let Hirely evaluate its
            strengths, weaknesses, skills, and overall
            recruiter readiness.
          </p>
        </header>

        {/* Form */}
        <div className="mt-8 space-y-6">
          {/* Upload */}
          <section className="rounded-xl border bg-surface p-6">
            <div>
              <h2 className="font-semibold">
                Upload your CV
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                PDF or DOCX files are supported.
              </p>
            </div>

            <label
              htmlFor="cv-upload"
              className={`mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition-colors ${
                file
                  ? "border-foreground bg-surface-muted"
                  : "hover:border-border-strong hover:bg-surface-muted"
              }`}
            >
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                disabled={isAnalyzing}
                onChange={(event) => {
                  const selectedFile =
                    event.target.files?.[0] ?? null;

                  setFile(selectedFile);
                  setError("");
                }}
              />

              {file ? (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border bg-surface">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M7 3h8l4 4v14H7z" />
                      <path d="M15 3v5h5" />
                      <path d="M10 13h5M10 17h4" />
                    </svg>
                  </div>

                  <p className="mt-3 max-w-full truncate text-sm font-medium">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Click to choose another file
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border bg-surface">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 16V4" />
                      <path d="m7 9 5-5 5 5" />
                      <path d="M5 20h14" />
                    </svg>
                  </div>

                  <p className="mt-3 text-sm font-medium">
                    Choose a CV to upload
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF or DOCX
                  </p>
                </>
              )}
            </label>
          </section>

          {/* Target role */}
          <section className="rounded-xl border bg-surface p-6">
            <div>
              <h2 className="font-semibold">
                Target role
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Optional. Giving Hirely a target role makes
                the analysis more relevant.
              </p>
            </div>

            <input
              type="text"
              value={targetRole}
              onChange={(event) =>
                setTargetRole(event.target.value)
              }
              placeholder="e.g. Frontend Engineer"
              disabled={isAnalyzing}
              className="mt-5 h-11 w-full rounded-lg border bg-surface px-3.5 text-sm placeholder:text-muted-foreground transition-colors hover:border-border-strong focus:border-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-danger">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-medium text-danger">
                    Analysis failed
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Analyze */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Analysis may take a few moments.
            </p>

            <button
              type="button"
              disabled={!file || isAnalyzing}
              onClick={handleSubmit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-150 hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Analyzing CV...
                </>
              ) : (
                "Analyze CV"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}