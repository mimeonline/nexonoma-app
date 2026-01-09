import Link from "next/link";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Card } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { Segment, SegmentContentItem, SegmentContentType } from "@/types/grid";
import { AssetType } from "@/types/nexonoma";

type SegmentBoardProps = {
  segments: Segment[];
};

type BoardItem = SegmentContentItem & {
  type: SegmentContentType;
};

function toCatalogTypeSlug(value: string) {
  return value.toLowerCase();
}

function buildSegmentItems(segment: Segment): BoardItem[] {
  const content = segment.content;
  if (!content) return [];

  const withType = (items: SegmentContentItem[], type: SegmentContentType) =>
    items.map((item) => ({
      ...item,
      type,
    }));

  return [
    ...withType(content.methods ?? [], AssetType.METHOD),
    ...withType(content.concepts ?? [], AssetType.CONCEPT),
    ...withType(content.tools ?? [], AssetType.TOOL),
    ...withType(content.technologies ?? [], AssetType.TECHNOLOGY),
  ];
}

export function SegmentBoard({ segments }: SegmentBoardProps) {
  const { t } = useI18n();

  const translateAssetLabel = (value: string) => {
    const key = `asset.labels.${value.toLowerCase()}`;
    return t(key);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max pr-2 snap-x snap-mandatory">
        {segments.map((segment) => {
          const items = buildSegmentItems(segment);
          const description = segment.longDescription || segment.shortDescription || t("grid.segments.segmentDescriptionFallback");

          return (
            <div
              key={segment.slug}
              className="flex w-[340px] shrink-0 snap-start flex-col rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="space-y-2 border-b border-white/10 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{segment.name}</h3>
                  <span className="text-[10px] font-mono text-slate-500">{items.length}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{description}</p>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3 max-h-[calc(100vh-360px)]">
                {items.map((item) => (
                  <Link key={item.slug} href={`/catalog/${toCatalogTypeSlug(item.type)}/${item.slug}`}>
                    <Card
                      variant="interactive"
                      className="rounded-xl border-white/10 bg-white/5 px-3 py-2 hover:border-white/20"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-white">{item.name}</span>
                        <Badge variant={getBadgeVariant(item.type)} size="sm" className="text-[10px] px-1.5 py-0">
                          {translateAssetLabel(item.type)}
                        </Badge>
                      </div>
                      {item.shortDescription && (
                        <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">{item.shortDescription}</p>
                      )}
                    </Card>
                  </Link>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-white/10 bg-white/5 px-3 py-3 text-center">
                    <span className="text-[11px] text-slate-600 italic">{t("grid.segments.emptyLane")}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
