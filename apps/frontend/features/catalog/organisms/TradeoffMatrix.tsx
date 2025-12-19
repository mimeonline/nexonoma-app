"use client";

import { Disclosure } from "@/components/molecules/Disclosure";

interface TradeoffItem {
  dimension: string;
  pros: string[];
  cons: string[];
}

export function TradeoffMatrix({ items }: { items?: TradeoffItem[] }) {
  if (!items?.length) {
    return <div className="text-sm text-slate-500">Keine Abwägungen definiert.</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <Disclosure key={idx} title={item.dimension} variant="card">
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 ">
            {/* PROS */}
            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-emerald-400">Pros</div>
              <ul className="list-disc space-y-1 pl-4 text-sm text-slate-400">
                {item.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* CONS */}
            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-red-400">Cons</div>
              <ul className="list-disc space-y-1 pl-4 text-sm text-slate-400">
                {item.cons.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </Disclosure>
      ))}
    </div>
  );
}
