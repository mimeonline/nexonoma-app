export type CatalogType = "concept" | "method" | "tool" | "technology" | string;

function typeBadgeClasses(type: CatalogType) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide";

  switch (String(type).toLowerCase()) {
    case "concept":
      return `${base} bg-indigo-500/20 text-indigo-200 border border-indigo-400/40`;
    case "method":
      return `${base} bg-amber-500/20 text-amber-200 border border-amber-400/40`;
    case "tool":
      return `${base} bg-emerald-500/20 text-emerald-200 border border-emerald-400/40`;
    case "technology":
      return `${base} bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400/40`;
    default:
      return `${base} bg-slate-500/20 text-slate-200 border border-slate-400/40`;
  }
}

interface TypeBadgeProps {
  type: CatalogType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const classes = typeBadgeClasses(type);
  const combined = className ? `${classes} ${className}` : classes;

  return <span className={combined}>{String(type).toUpperCase()}</span>;
}

export function normalizeCatalogType(type?: string) {
  const normalized = (type ?? "").toLowerCase();
  if (normalized === "concept" || normalized === "method" || normalized === "tool" || normalized === "technology") {
    return normalized as "concept" | "method" | "tool" | "technology";
  }
  return "unknown" as const;
}
