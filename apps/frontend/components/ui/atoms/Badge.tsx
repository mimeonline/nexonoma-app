import { cn } from "@/lib/utils";
import * as React from "react";

// --- Types ---
export type BadgeVariant = "default" | "outline" | "concept" | "method" | "tool" | "technology" | "ocean" | "aqua";

export type BadgeSize = "sm" | "md" | "lg";
export type BadgeRadius = "full" | "md" | "sm";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  radius?: BadgeRadius; // NEU
}

// --- Styles ---
const variants: Record<BadgeVariant, string> = {
  default: "border-transparent bg-nexo-card text-text-secondary",
  outline: "border-text-muted/40 text-text-muted bg-transparent",

  concept: "border-accent-primary/20 bg-accent-primary/10 text-accent-primary shadow-card",
  method: "border-success/20 bg-success/10 text-success shadow-card",
  tool: "border-warning/20 bg-warning/10 text-warning shadow-card",
  technology: "border-error/20 bg-error/10 text-error shadow-card",

  ocean: "border-accent-primary/20 bg-accent-primary/10 text-accent-primary",
  aqua: "border-accent-primary/20 bg-accent-primary/10 text-accent-primary",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[9px] tracking-wide",
  md: "px-2.5 py-0.5 text-[10px] tracking-wider",
  lg: "px-3 py-1 text-xs tracking-wider",
};

const radii: Record<BadgeRadius, string> = {
  full: "rounded-full",
  md: "rounded-lg",
  sm: "rounded",
};

export function Badge({
  className,
  variant = "default",
  size = "sm",
  radius = "md",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center border font-bold uppercase whitespace-nowrap transition-colors",
        variants[variant],
        sizes[size],
        radii[radius], // Hier wird der Radius angewendet
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function getBadgeVariant(type: string | undefined | null): BadgeVariant {
  if (!type) return "default";
  const t = type.toLowerCase();
  if (t.includes("concept")) return "concept";
  if (t.includes("method")) return "method";
  if (t.includes("tool")) return "tool";
  if (t.includes("tech")) return "technology";
  return "default";
}
