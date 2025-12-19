// components/FieldLabel.tsx
import { InfoPopover } from "../atoms/InfoPopover";

interface FieldLabelProps {
  label: string;
  infoKey?: string;
  className?: string;
}

export function FieldLabel({ label, infoKey, className }: FieldLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {infoKey && <InfoPopover infoKey={infoKey} />}
    </div>
  );
}
