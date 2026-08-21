import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export default function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-accent text-accent-foreground",
    success:
      "bg-success/10 text-success",
    warning:
      "bg-warning/10 text-warning",
    danger:
      "bg-danger/10 text-danger",
  };

  return (
    <span
      {...props}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    />
  );
}