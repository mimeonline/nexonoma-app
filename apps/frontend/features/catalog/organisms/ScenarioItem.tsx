// features/catalog/organisms/ScenarioItem.tsx
import { Disclosure } from "@/components/molecules/Disclosure";
import { Scenario } from "@/types/nexonoma";

interface LocalizedText {
  de?: string;
  en?: string;
}

export function ScenarioItem({ scenario }: { scenario: Scenario }) {
  return (
    <Disclosure
      title={scenario.name}
      variant="custom"
      containerClassName="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-3"
      triggerClassName="py-1 text-sm text-slate-300 hover:text-slate-100"
    >
      {scenario.context && <p className="mt-2 text-slate-400 leading-relaxed">{scenario.context}</p>}

      {scenario.steps && scenario.steps.length > 0 && (
        <ol className="mt-3 list-decimal pl-5 text-slate-400 space-y-1">
          {scenario.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      )}
    </Disclosure>
  );
}
