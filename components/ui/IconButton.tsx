import type { ButtonHTMLAttributes } from "react";

type IconButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
  };

export default function IconButton({
  label,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50 ${className}`}
    />
  );
}