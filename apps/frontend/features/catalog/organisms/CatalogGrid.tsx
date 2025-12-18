"use client";

import Link from "next/link";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { CatalogItem } from "@/types/catalog";

interface CatalogGridProps {
  items: CatalogItem[];
}

export function CatalogGrid({ items }: CatalogGridProps) {
  const { t } = useI18n();

  const translateTypeLabel = (value: string) => {
    const key = `asset.labels.${value.toLowerCase()}`;
    return t(key);
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Link key={`${item.id}-${item.slug}`} href={`/catalog/${item.type}/${item.slug}`} className="block">
          <Card variant="interactive" className="flex flex-col h-full min-h-40 group cursor-pointer">
            <CardHeader className="pb-2 space-y-0">
              <div className="flex items-start">
                <Badge variant={getBadgeVariant(item.type)} size="sm">
                  {translateTypeLabel(item.type)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <CardTitle className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-nexo-ocean transition-colors">
                {item.name}
              </CardTitle>
              <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                {item.shortDescription || t("catalog.gridMeta.shortDescriptionFallback")}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}
