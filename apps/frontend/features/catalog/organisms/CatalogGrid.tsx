"use client";

import Link from "next/link";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";
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

  const toCatalogTypeSlug = (value: string) => value.toLowerCase();

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Link key={`${item.id}-${item.slug}`} href={`/catalog/${toCatalogTypeSlug(item.type)}/${item.slug}`} className="block">
          <Card variant="interactive" className="flex flex-col h-full min-h-40 group cursor-pointer">
            <CardHeader className="pb-2 space-y-0">
              <div className="flex items-start">
                <Badge variant={getBadgeVariant(item.type)} size="sm">
                  {translateTypeLabel(item.type)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {/* Wrapper regelt den Abstand nach unten (mb-2) */}
              <div className="flex items-start gap-3 mb-2">
                {/* Icon auf h-5 w-5 vergrößert für Balance & mt-1 für Ausrichtung an der ersten Zeile */}
                <DynamicIcon name={item.icon} className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />

                <CardTitle className="text-lg font-bold text-white mb-0! line-clamp-2 leading-tight group-hover:text-nexo-ocean transition-colors">
                  {item.name}
                </CardTitle>
              </div>

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
