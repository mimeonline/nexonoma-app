// features/catalog/organisms/ScenarioList.tsx
import { ScenarioItem } from "./ScenarioItem";

export function ScenarioList({ scenarios }: { scenarios: any[] }) {
  return (
    <div className="space-y-2">
      {scenarios.map((sc, idx) => (
        <ScenarioItem key={idx} scenario={sc} />
      ))}
    </div>
  );
}
