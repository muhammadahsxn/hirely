import type { InputHTMLAttributes } from "react";

export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-lg border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 hover:border-border-strong focus:border-foreground focus:outline-none ${className}`}
    />
  );
}