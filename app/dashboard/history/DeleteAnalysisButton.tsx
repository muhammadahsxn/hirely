"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAnalysis } from "./actions";

export default function DeleteAnalysisButton({
    analysisId,
}: {
    analysisId: string;
}) {
    const router = useRouter();

    const [isPending, startTransition] =
        useTransition();

    const [confirming, setConfirming] =
        useState(false);

    function handleDelete() {
        startTransition(async () => {
            try {
                await deleteAnalysis(analysisId);

                router.refresh();
            } catch (error) {
                console.error(error);
                setConfirming(false);
            }
        });
    }

    if (confirming) {
        return (
            <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setConfirming(false)}
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={isPending}
                    onClick={handleDelete}
                    className="rounded-md bg-danger px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isPending ? "Deleting..." : "Delete"}
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            aria-label="Delete analysis"
            title="Delete analysis"
            onClick={() => setConfirming(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground opacity-70 transition-all hover:bg-danger/10 hover:text-danger md:opacity-0 md:group-hover:opacity-100"
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4"
            >
                <path d="M4 7h16" />
                <path d="M10 11v6M14 11v6" />
                <path d="M6 7l1 14h10l1-14" />
                <path d="M9 7V4h6v3" />
            </svg>
        </button>
    );
}