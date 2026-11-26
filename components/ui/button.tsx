import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * One primary style across the site: square navy block with a trailing arrow ("Request access").
 * Secondary is a 2px ink outline ("Explore BNC"); ghost is a text link. Never put two primaries side by side.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-none font-bold whitespace-nowrap transition-colors duration-fast ease-out disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "border-2 border-accent bg-accent text-on-accent hover:border-accent-hover hover:bg-accent-hover active:bg-accent-press",
  secondary: "border-2 border-line-strong text-fg hover:bg-fg hover:text-bg",
  ghost: "text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg px-1",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-5 text-body-sm",
  lg: "px-6 text-body",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], variant !== "ghost" && sizes[size], className);
}

type LinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", size = "md", className, children, ...rest }: LinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {variant === "primary" && <span aria-hidden="true">→</span>}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize };

export function Button({ variant = "primary", size = "md", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />;
}
