type CatalogType = "concept" | "method" | "tool" | "technology" | string;

interface TypeOption {
  value: CatalogType;
  label: string;
}

interface TypeFilterChipsProps {
  options: TypeOption[];
  activeType: CatalogType;
  onSelect: (type: CatalogType) => void;
}

export function TypeFilterChips({ options, activeType, onSelect }: TypeFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
            activeType === opt.value
              ? "bg-white text-slate-900 shadow"
              : "border border-white/20 text-slate-200 hover:border-white/50 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
