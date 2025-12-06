import { cn } from "@/lib/utils";
import * as React from "react";

// --- Types ---
export type BadgeVariant = "default" | "outline" | "concept" | "method" | "tool" | "technology" | "ocean" | "aqua";

export type BadgeSize = "sm" | "md" | "lg";
export type BadgeRadius = "full" | "md" | "sm"; // NEU: Radius Option

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  radius?: BadgeRadius; // NEU
}

// --- Styles ---
const variants: Record<BadgeVariant, string> = {
  default: "border-transparent bg-slate-800 text-slate-300",
  outline: "border-slate-700 text-slate-400 bg-transparent",

  concept: "border-nexo-ocean/20 bg-nexo-ocean/10 text-nexo-ocean shadow-[0_0_10px_-3px_rgba(56,189,248,0.15)]",
  method: "border-nexo-aqua/20 bg-nexo-aqua/10 text-nexo-aqua shadow-[0_0_10px_-3px_rgba(79,244,224,0.15)]",
  tool: "border-purple-500/20 bg-purple-500/10 text-purple-400 shadow-[0_0_10px_-3px_rgba(168,85,247,0.15)]",
  technology: "border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-[0_0_10px_-3px_rgba(249,115,22,0.15)]",

  ocean: "border-nexo-ocean/20 bg-nexo-ocean/10 text-nexo-ocean",
  aqua: "border-nexo-aqua/20 bg-nexo-aqua/10 text-nexo-aqua",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[9px] tracking-wide",
  md: "px-2.5 py-0.5 text-[10px] tracking-wider",
  lg: "px-3 py-1 text-xs tracking-wider",
};

// NEU: Radius Styles
const radii: Record<BadgeRadius, string> = {
  full: "rounded-full", // Standard (Pille)
  md: "rounded-md", // Leicht abgerundet (Tech Look)
  sm: "rounded", // Fast eckig (Tags)
};

export function Badge({
  className,
  variant = "default",
  size = "sm",
  radius = "full", // Default bleibt Pille
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
