"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: "Analyze CV",
    href: "/dashboard/analyze",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="M5 5l14 14" />
        <path d="M19 5L5 19" />
      </svg>
    ),
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

const bottomNavigation = [
  {
    name: "Account",
    href: "/dashboard/account",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
        <path d="M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        <path d="M3 12h2M19 12h2M12 3v2M12 19v2" />
      </svg>
    ),
  },
];

function NavigationItem({
  item,
  pathname,
}: {
  item: (typeof navigation)[number];
  pathname: string;
}) {
  const active =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <span className="h-[17px] w-[17px] shrink-0">
        {item.icon}
      </span>

      <span>{item.name}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight"
        >
          Hirely
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              pathname={pathname}
            />
          ))}
        </div>
      </nav>

      {/* Account navigation */}
      <div className="shrink-0 border-t p-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Personal
        </p>

        <div className="space-y-1">
          {bottomNavigation.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              pathname={pathname}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}