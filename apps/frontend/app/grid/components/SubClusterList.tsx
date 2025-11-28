import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cluster } from "../data/categories";

type Props = {
  cluster: Cluster;
};

export function SubClusterList({ cluster }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {cluster.subclusters.map((sub) => (
        <Card
          key={sub.slug}
          className="border border-white/10 bg-[#0B1220] text-white shadow-md shadow-black/20 transition hover:border-cyan-400"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{sub.title}</CardTitle>
            <p className="text-xs text-slate-300">{cluster.title}</p>
          </CardHeader>
          <CardContent className="flex justify-between pt-0 text-sm text-slate-200/80">
            <span>{sub.segments.length} Segmente</span>
            <Link
              href={`/grid/${cluster.slug}/${sub.slug}`}
              className="font-semibold text-[#4FF4E0] hover:underline"
            >
              Öffnen
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
