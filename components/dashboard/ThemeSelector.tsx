"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  if (theme === "light") {
    root.classList.remove("dark");
    return;
  }

  const systemDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  root.classList.toggle("dark", systemDark);
}

export default function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const storedTheme = localStorage.getItem(
      "hirely-theme"
    ) as Theme | null;

    const initialTheme: Theme =
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
        ? storedTheme
        : "system";

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function handleThemeChange(newTheme: Theme) {
    setTheme(newTheme);
    localStorage.setItem("hirely-theme", newTheme);
    applyTheme(newTheme);
  }

  return (
    <div className="mt-6">
      <p className="font-medium">
        Theme
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Choose how Hirely looks across your dashboard.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["system", "light", "dark"] as Theme[]).map(
          (option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleThemeChange(option)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                theme === option
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {option}
            </button>
          )
        )}
      </div>
    </div>
  );
}