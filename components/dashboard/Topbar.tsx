"use client";

import Link from "next/link";

export default function Topbar({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenMobileSidebar,
}: {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-[18px] w-[18px]"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Brand */}
        <Link
          href="/dashboard"
          className="shrink-0 text-lg font-semibold tracking-tight"
        >
          Hirely
        </Link>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* Context */}
        <p className="hidden truncate text-sm text-muted-foreground sm:block">
          AI-powered CV analysis
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Desktop sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            sidebarCollapsed
              ? "Expand navigation"
              : "Collapse navigation"
          }
          className="hidden h-9 w-9 items-center justify-center rounded-lg border bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-[17px] w-[17px]"
          >
            {sidebarCollapsed ? (
              <path
                d="m9 18 6-6-6-6"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="m15 18-6-6 6-6"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>

        {/* Account */}
        <Link
          href="/dashboard/account"
          aria-label="Account"
          className="flex h-9 w-9 items-center justify-center rounded-lg border bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
      </div>
    </header>
  );
}