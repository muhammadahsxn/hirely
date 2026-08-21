"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Analyze CV", href: "/dashboard/analyze" },
  { name: "History", href: "/dashboard/history" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background p-4">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold">Hirely</h1>
        <p className="text-sm text-muted-foreground">AI CV Analyzer</p>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}