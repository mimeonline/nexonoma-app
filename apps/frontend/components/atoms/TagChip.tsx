import * as React from "react";

import { cn } from "@/lib/utils";

type TagChipVariant = "card" | "detail";

interface TagChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  title?: string;
  variant?: TagChipVariant;
}

const baseClasses =
  "inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-sm border border-slate-700/60 bg-slate-800/60 text-[11px] leading-none text-slate-300 transition-colors hover:bg-slate-700/60";

const variantClasses: Record<TagChipVariant, string> = {
  card: "max-w-[140px] whitespace-nowrap truncate",
  detail: "whitespace-nowrap",
};

export function TagChip({ label, title, variant = "card", className, ...props }: TagChipProps) {
  return (
    <span
      className={cn(baseClasses, variantClasses[variant], className)}
      title={title ?? label}
      {...props}
    >
      {label}
    </span>
  );
}
