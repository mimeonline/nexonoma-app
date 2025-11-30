import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentItem } from "@/types/grid";

type Props = {
  item: ContentItem;
  path: {
    cluster: string;
    segment: string;
    type: ContentItem["type"];
  };
};

export function ContentDetail({ item, path }: Props) {
  return (
    <Card className="border border-white/10 bg-[#1A2E5D] text-white">
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-200/70">
          {path.cluster} / {path.segment} / {path.type}
        </p>
        <CardTitle className="text-2xl">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-slate-200/85">
        <p>{item.shortDescription}</p>
        <div className="rounded-lg border border-white/10 bg-[#0B1220] p-4 text-sm">
          Weitere Felder können hier ergänzt werden (Owner, Tags, Links, etc.).
        </div>
      </CardContent>
    </Card>
  );
}
