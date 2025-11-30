import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Segment } from "@/types/grid";

type Props = {
  clusterSlug: string;
  segments: Array<{ segment: Segment; subclusterSlug: string }>;
};

export function SegmentList({ clusterSlug, segments }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {segments.map(({ segment, subclusterSlug }) => (
        <Card
          key={`${subclusterSlug}-${segment.slug}`}
          className="border border-white/10 bg-[#1A2E5D] text-white transition hover:border-cyan-400"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{segment.name}</CardTitle>
            <p className="text-sm text-slate-300">{segment.slug}</p>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-0 text-sm text-slate-200/85">
            <span>4 Content-Typen</span>
            <Link
              href={`/grid/${clusterSlug}/${subclusterSlug}/${segment.slug}`}
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
