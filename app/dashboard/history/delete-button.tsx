"use client";

import { useTransition } from "react";
import { deleteAnalysis } from "./actions";

type DeleteButtonProps = {
  analysisId: string;
};

export default function DeleteButton({
  analysisId,
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this CV analysis? This cannot be undone."
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteAnalysis(analysisId);
        window.location.reload();
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : "Failed to delete analysis."
        );
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}