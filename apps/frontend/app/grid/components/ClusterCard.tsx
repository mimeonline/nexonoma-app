import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap } from "./icons";
import type { Cluster } from "../data/categories";

type Props = {
  cluster: Cluster;
  isOpen: boolean;
  onToggle: (slug: string) => void;
};

export function ClusterCard({ cluster, isOpen, onToggle }: Props) {
  const Icon = iconMap[cluster.icon] ?? iconMap.Default;

  return (
    <Card
      className={`w-full overflow-hidden border border-white/10 bg-[#1A2E5D] text-white transition-all duration-300 hover:border-cyan-400 ${
        isOpen
          ? "border-cyan-400 bg-[#1F2B4A] shadow-lg shadow-cyan-400/10 shadow-[inset_0_0_25px_rgba(79,244,224,0.15)]"
          : ""
      }`}
    >
      <button
        onClick={() => onToggle(cluster.slug)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-cyan-300">
            <Icon className="h-5 w-5" />
          </span>
          <CardHeader className="p-0">
            <CardTitle className="text-lg">{cluster.title}</CardTitle>
            <p className="text-sm text-slate-200/75">Sub-Cluster anzeigen</p>
          </CardHeader>
        </div>
        <span
          className={`text-sm font-semibold transition duration-300 ${
            isOpen ? "text-cyan-300" : "text-slate-300"
          }`}
        >
          {isOpen ? "–" : "+"}
        </span>
      </button>
      {isOpen && (
        <CardContent className="animate-fadeIn border-t border-white/5 bg-[#0B1220]/40">
          <p className="text-sm text-slate-200/80">
            Wähle einen Sub-Cluster oder öffne die Cluster-Seite.
          </p>
        </CardContent>
      )}
    </Card>
  );
}
