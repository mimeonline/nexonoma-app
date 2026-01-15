"use client";

interface Metric {
  name: string;
  description: string;
}

export function MetricsList({ items }: { items?: Metric[] }) {
  if (!items?.length) {
    return <div className="rounded-md bg-slate-900/20 p-4 text-sm text-slate-500">Keine Metriken definiert.</div>;
  }

  return (
    <ul className="space-y-4">
      {items.map((metric, idx) => (
        <li key={idx} className="">
          <div className="text-sm font-semibold text-slate-200">{metric.name}</div>
          <p className="mt-1 text-sm text-slate-400">{metric.description}</p>
        </li>
      ))}
    </ul>
  );
}
