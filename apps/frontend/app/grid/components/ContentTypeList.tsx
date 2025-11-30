import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentGroup, ContentType } from "@/types/grid";

type Props = {
  clusterSlug: string;
  subclusterSlug: string;
  segmentSlug: string;
  contents: ContentGroup;
};

const contentMap: Array<{ key: keyof ContentGroup; label: string; type: ContentType }> = [
  { key: "concepts", label: "Concept", type: "concept" },
  { key: "methods", label: "Method", type: "method" },
  { key: "tools", label: "Tool", type: "tool" },
  { key: "technologies", label: "Technology", type: "technology" },
];

export function ContentTypeList({ clusterSlug, subclusterSlug, segmentSlug, contents }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {contentMap.map(({ key, label, type }) => {
        const items = contents[key] ?? [];
        const first = items[0];
        return (
          <Card
            key={key}
            className="border border-white/10 bg-[#1A2E5D] text-white transition hover:border-cyan-400"
          >
            <CardHeader className="pb-1">
              <CardTitle className="text-lg">{label}</CardTitle>
              <p className="text-sm text-slate-300">{items.length} Einträge</p>
            </CardHeader>
            <CardContent className="pt-1 text-sm text-slate-200/85">
              <p className="mb-3">Öffne die Liste oder direkt ein Detail.</p>
              {first ? (
                <div className="flex gap-3 text-[#4FF4E0] font-semibold">
                  <Link
                    href={`/grid/${clusterSlug}/${subclusterSlug}/${segmentSlug}/${type}/${first.slug}`}
                    className="hover:underline"
                  >
                    Erstes Detail öffnen
                  </Link>
                </div>
              ) : (
                <p className="text-slate-300">Keine Einträge verfügbar.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
