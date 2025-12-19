import { UseCase } from "@/types/nexonoma";
import { UseCaseItem } from "./UseCaseItem";

export function UseCaseList({ useCases }: { useCases: UseCase[] }) {
  return (
    <div className="space-y-2">
      {useCases.map((uc) => (
        <UseCaseItem key={uc.name} useCase={uc} />
      ))}
    </div>
  );
}
