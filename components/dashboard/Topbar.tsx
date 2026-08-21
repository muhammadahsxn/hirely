"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <header className="fixed top-0 right-0 left-64 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      {/* Mobile/secondary brand space */}
      <div className="flex items-center">
        <p className="text-sm text-muted-foreground">
          AI-powered CV analysis
        </p>
      </div>

      {/* Account */}
      <Link
        href="/dashboard/account"
        aria-label="Account"
        className="flex h-9 w-9 items-center justify-center rounded-lg border bg-surface text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="h-[17px] w-[17px]"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
        </svg>
      </Link>
    </header>
  );
}