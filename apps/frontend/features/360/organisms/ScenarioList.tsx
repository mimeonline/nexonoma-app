import { ScenarioItem } from "./ScenarioItem";
import { Scenario } from "@/types/nexonoma";

export function ScenarioList({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <div className="space-y-2">
      {scenarios.map((sc, idx) => (
        <ScenarioItem key={idx} scenario={sc} />
      ))}
    </div>
  );
}
