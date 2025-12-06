import { Card } from "@/components/ui/atoms/Card";

interface CatalogPreviewCardProps {
  title: string;
  type: string;
  color: string;
}

export function CatalogPreviewCard({ title, type, color }: CatalogPreviewCardProps) {
  return (
    <Card className="flex flex-col gap-2 p-4 border-white/5 bg-nexo-card shadow-none">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-lg bg-white/5"></div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>{type}</span>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-white/20"></div>
        <div className="h-2 w-1/2 rounded-full bg-white/10"></div>
      </div>
      <div className="mt-2 text-xs font-semibold text-slate-300 truncate">{title}</div>
    </Card>
  );
}
