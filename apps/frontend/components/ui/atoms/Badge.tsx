import { cn } from "@/lib/utils";
import * as React from "react";

// --- Types ---
export type BadgeVariant =
  | "default"
  | "outline"
  // Content Types (Semantic)
  | "concept"
  | "method"
  | "tool"
  | "technology"
  // Brand Colors (Visual)
  | "ocean"
  | "aqua";

export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

// --- Styles ---
const variants: Record<BadgeVariant, string> = {
  // Standard UI
  default: "border-transparent bg-slate-800 text-slate-300",
  outline: "border-slate-700 text-slate-400 bg-transparent",

  // Content Types (Abgestimmt auf Catalog & Grid)
  concept: "bg-sky-500/15 text-sky-200 border-sky-500/30 shadow-[0_0_10px_-3px_rgba(56,189,248,0.15)]",
  method: "bg-purple-500/15 text-purple-200 border-purple-500/30 shadow-[0_0_10px_-3px_rgba(79,244,224,0.15)]",
  tool: "bg-teal-500/15 text-teal-200 border-teal-500/30 shadow-[0_0_10px_-3px_rgba(168,85,247,0.15)]",
  technology: "bg-amber-500/15 text-amber-200 border-amber-500/30 shadow-[0_0_10px_-3px_rgba(249,115,22,0.15)]",

  // Brand Specific
  ocean: "border-nexo-ocean/20 bg-nexo-ocean/10 text-nexo-ocean",
  aqua: "border-nexo-aqua/20 bg-nexo-aqua/10 text-nexo-aqua",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[9px] tracking-wide", // Für Cards / Grid
  md: "px-2.5 py-0.5 text-[10px] tracking-wider", // Für Listen / Pipeline
  lg: "px-3 py-1 text-xs tracking-wider", // Für SectionTitles / Detail-Pages
};

export function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-full border font-bold uppercase whitespace-nowrap transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Helper: Mappt einen beliebigen String (z.B. aus der DB) auf eine valide Badge-Variante.
 * @example <Badge variant={getBadgeVariant(item.type)}>{item.type}</Badge>
 */
export function getBadgeVariant(type: string | undefined | null): BadgeVariant {
  if (!type) return "default";

  const t = type.toLowerCase();
  if (t.includes("concept")) return "concept";
  if (t.includes("method")) return "method";
  if (t.includes("tool")) return "tool";
  if (t.includes("tech")) return "technology";

  return "default";
}
