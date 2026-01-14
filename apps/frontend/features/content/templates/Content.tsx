"use client";

import Link from "next/link";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { TagChip } from "@/components/atoms/TagChip";
import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Card } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type { ContentResponse, ContentTag } from "@/types/content";

type HeroMetaTone = "neutral" | "accent" | "warning";

type ContentTemplateProps = {
  lang: string;
  data: ContentResponse;
};

const metaToneClasses: Record<HeroMetaTone, string> = {
  neutral: "text-white bg-white/10 border-white/10",
  accent: "text-nexo-aqua bg-nexo-aqua/10 border-nexo-aqua/20",
  warning: "text-warning bg-warning/10 border-warning/20",
};

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-display font-semibold text-white", className)}>{children}</h2>;
}

function HoverCardLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "group block w-full rounded-xl border border-white/5 bg-nexo-card p-4 transition-all duration-200 ease-out hover:border-white/20 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function sortTags(tags: ContentTag[] = [], order: string[] = []): ContentTag[] {
  if (!order.length) return [...tags].sort((a, b) => a.slug.localeCompare(b.slug));
  const orderIndex = new Map(order.map((slug, idx) => [slug, idx] as const));
  return [...tags].sort((a, b) => {
    const ai = orderIndex.has(a.slug) ? orderIndex.get(a.slug)! : Number.MAX_SAFE_INTEGER;
    const bi = orderIndex.has(b.slug) ? orderIndex.get(b.slug)! : Number.MAX_SAFE_INTEGER;
    if (ai === bi) return a.slug.localeCompare(b.slug);
    return ai - bi;
  });
}

function relationSubtitle(type: string | null, relation: string | null, t: ReturnType<typeof useI18n>["t"]): string {
  if (!type && !relation) return t("content.relations.subtitleFallback");
  const typeKey = type ? type.toLowerCase() : "unknown";
  const relKey = relation ? relation.toLowerCase() : "unknown";
  const key = `content.relations.${typeKey}.${relKey}`;
  const translated = t(key);
  if (translated === key) {
    // missing translation fallback
    return [type, relation].filter(Boolean).join(" · ") || t("content.relations.subtitleFallback");
  }
  return translated;
}

export function ContentTemplate({ lang, data }: ContentTemplateProps) {
  const { t } = useI18n();

  const { assetBlock, structure, relations } = data;
  const sortedTags = sortTags(assetBlock.tags, assetBlock.tagOrder);

  const typeLabel = t(`asset.enums.types.${assetBlock.type}.label`);

  return (
    <div className="space-y-8 pb-20">
      <div>
        <Link
          href={`/${lang}/catalog`}
          className="group inline-flex items-center gap-2 text-xs font-medium text-text-secondary transition-colors duration-200 ease-out hover:text-white"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-colors duration-200 ease-out group-hover:border-white/20">
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          <span>{t("content.backToCatalog")}</span>
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-stretch">
        <Card className="bg-nexo-surface p-8 duration-200 ease-out">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant={getBadgeVariant(assetBlock.type.toLowerCase())} size="md" radius="sm">
              {typeLabel}
            </Badge>
            {sortedTags.map((tag) => (
              <TagChip key={tag.slug} label={`#${tag.label}`} variant="detail" />
            ))}
          </div>

          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-nexo-card">
              <DynamicIcon name={assetBlock.icon ?? undefined} className="h-8 w-8 text-nexo-aqua" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{assetBlock.name}</h1>
              <p className="text-[15px] text-text-secondary leading-relaxed max-w-2xl">{assetBlock.shortDescription}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4 rounded-lg border border-white/5 border-l-2 border-l-nexo-aqua/60 bg-nexo-bg/40 p-4">
            <p className="text-sm text-text-secondary">{t("content.hero.note")}</p>
          </div>
        </Card>

        <div className="flex h-full flex-col gap-4">
          <Card className="p-5 duration-200 ease-out">
            <Link
              href={`/${lang}/catalog/${assetBlock.type.toLowerCase()}/${assetBlock.slug}`}
              className="flex items-center justify-center w-full gap-2 rounded-xl bg-accent-primary px-4 py-3 text-sm font-semibold text-nexo-bg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-primary/90"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {t("content.cta.label")}
            </Link>
            <p className="mt-3 text-center text-xs text-text-muted">{t("content.cta.hint")}</p>
          </Card>

          <Card className="flex-1 bg-nexo-surface p-6 duration-200 ease-out">
            <h2 className="text-lg font-display font-semibold text-white">{t("content.info.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t("content.info.body")}</p>
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle className="mb-4 px-1">{t("content.basics.title")}</SectionTitle>

        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-px bg-linear-to-r from-cyan-400/30 via-indigo-400/30 to-amber-400/30" />

          <div className="flex w-full gap-3 flex-wrap">
            {[
              { id: "type", label: t("asset.properties.type.label"), value: typeLabel, tone: "neutral" as const },
              {
                id: "org-level",
                label: t("asset.properties.organizationalLevel.label"),
                value: assetBlock.organisationLevel ?? t("content.basics.unknown"),
                tone: "neutral" as const,
              },
              {
                id: "decision",
                label: t("asset.properties.decisionType.label"),
                value: assetBlock.decisionType ?? t("content.basics.unknown"),
                tone: "neutral" as const,
              },
              {
                id: "complexity",
                label: t("asset.properties.complexityLevel.label"),
                value: assetBlock.complexityLevel ?? t("content.basics.unknown"),
                tone: "neutral" as const,
              },
              {
                id: "valueStream",
                label: t("asset.properties.valueStreamStage.label"),
                value: assetBlock.valueStream ?? t("content.basics.unknown"),
                tone: "neutral" as const,
              },
              {
                id: "maturity",
                label: t("asset.properties.maturityLevel.label"),
                value: assetBlock.maturityLevel ?? t("content.basics.unknown"),
                tone: "accent" as const,
              },
              {
                id: "cognitive",
                label: t("asset.properties.cognitiveLoad.label"),
                value: assetBlock.cognitiveLoad ?? t("content.basics.unknown"),
                tone: "warning" as const,
              },
            ].map((fact) => (
              <Card key={fact.id} className="flex-1 min-w-[180px] p-4 text-center transition hover:ring-1 hover:ring-cyan-400/30">
                <div className="mb-1.5 text-[10px] uppercase tracking-wider text-text-muted ">{fact.label}</div>

                <span className={cn("inline-flex rounded border px-2 py-0.5 text-[10px] font-bold tracking-wide", metaToneClasses[fact.tone])}>
                  {fact.value}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-4 px-1">
            <SectionTitle>{t("content.structure.title")}</SectionTitle>
          </div>
          <Card className="flex-1 bg-nexo-surface p-5 duration-200 ease-out">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-nexo-card text-text-secondary">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t("content.structure.subtitle")}</h3>
                <p className="mt-0.5 text-xs text-text-muted">{t("content.structure.hint")}</p>
              </div>
            </div>

            {structure.paths.length === 0 ? (
              <p className="text-sm text-text-muted">{t("content.structure.empty")}</p>
            ) : (
              <div className="space-y-3">
                {structure.paths.map((item, idx) => (
                  <HoverCardLink key={`${item.segment.slug}-${idx}`} href={`/${lang}/catalog`} className="p-3">
                    <div className="text-sm font-medium text-white mb-1">
                      {item.macroCluster.name} → {item.cluster.name} → {item.segment.name}
                    </div>
                    {item.segment.tags && item.segment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-[11px] text-text-secondary">
                        {sortTags(item.segment.tags, item.segment.tagOrder).map((tag) => (
                          <span
                            key={tag.slug}
                            className="inline-flex rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-text-secondary"
                          >
                            #{tag.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </HoverCardLink>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col">
          <div className="mb-4 px-1">
            <SectionTitle>{t("content.relations.title")}</SectionTitle>
          </div>
          <Card className="flex-1 bg-nexo-surface p-5 duration-200 ease-out">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-nexo-card text-nexo-aqua">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t("content.relations.subtitle")}</h3>
                <p className="mt-0.5 text-xs text-text-muted">{t("content.relations.hint")}</p>
              </div>
            </div>

            {relations.items.length === 0 ? (
              <p className="text-sm text-text-muted">{t("content.relations.empty")}</p>
            ) : (
              <div className="space-y-3">
                {relations.items.map((relation) => (
                  <HoverCardLink
                    key={relation.id}
                    href={`/${lang}/content/${relation.node.type.toLowerCase()}/${relation.node.slug}`}
                    className="p-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-nexo-card text-[10px] font-bold text-text-secondary transition-colors duration-200 ease-out group-hover:text-white">
                          <DynamicIcon name={relation.node.icon ?? undefined} className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-white">{relation.node.name}</div>
                          <div className="truncate text-[11px] text-text-muted">{relationSubtitle(relation.type, relation.relation, t)}</div>
                        </div>
                      </div>
                      <span className="rounded p-1 text-text-muted transition-colors duration-200 ease-out group-hover:text-white">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </HoverCardLink>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle className="mb-4 px-1">{t("content.description.title")}</SectionTitle>
        <Card className="p-6 duration-200 ease-out">
          <p className="text-[15px] leading-7 text-text-secondary whitespace-pre-line">{assetBlock.longDescription}</p>
        </Card>
      </section>
    </div>
  );
}
