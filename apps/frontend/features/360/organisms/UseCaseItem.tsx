import { Disclosure } from "@/components/molecules/Disclosure";
import { UseCase } from "@/types/nexonoma";

export function UseCaseItem({ useCase }: { useCase: UseCase }) {
  return (
    <Disclosure
      title={useCase.name}
      variant="custom"
      containerClassName="text-sm text-slate-300 border-l-2 border-blue-500/30 pl-3"
      triggerClassName="py-1 text-sm text-slate-300 hover:text-slate-100"
    >
      {useCase.inputs && useCase.inputs.length > 0 && (
        <div className="mt-2">
          <strong>Inputs:</strong>
          <ul className="list-disc pl-5">
            {useCase.inputs.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {useCase.outputs && useCase.outputs.length > 0 && (
        <div className="mt-2">
          <strong>Outputs:</strong>
          <ul className="list-disc pl-5">
            {useCase.outputs.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      )}
    </Disclosure>
  );
}
