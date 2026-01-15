"use client";

import Link from "next/link";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { ExplainableLabel } from "@/components/atoms/ExplainableLabel";
import { TagChip } from "@/components/atoms/TagChip";
import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Card } from "@/components/ui/atoms/Card";
import { ContextActionsBar } from "@/components/ui/molecules/ContextActionsBar";
import { useEnumAssetLabel, useI18n, type AssetEnumType } from "@/features/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type { ContentResponse, ContentTag } from "@/types/content";
import { useMemo, useState } from "react";

type HeroMetaTone = "neutral" | "accent" | "warning";

type ContentTemplateProps = {
  lang: string;
  data: ContentResponse;
};

type SpecRow = {
  id: string;
  label: string;
  field: AssetEnumType;
  value: string;
  valueKey?: string | null;
  tone?: "accent" | "warning";
};

type SpecSection = {
  id: string;
  titleKey: string;
  rows: SpecRow[];
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

export function ContentTemplate({ lang, data }: ContentTemplateProps) {
  const { t } = useI18n();
  const localePrefix = lang ? `/${lang}` : "";
  const enumAssetLabel = useEnumAssetLabel();

  const { assetBlock, structure, relations } = data;
  const sortedTags = useMemo(() => sortTags(assetBlock.tags, assetBlock.tagOrder).slice(0, 2), [assetBlock.tags, assetBlock.tagOrder]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const typeLabel = t(`asset.enums.types.${assetBlock.type}.label`);
  const descriptionHasToggle = assetBlock.longDescription && assetBlock.longDescription.length > 260;
  const showDescription = assetBlock.longDescription || t("content.description.fallback");

  const fmtEnum = (enumType: Parameters<typeof enumAssetLabel>[0], value?: string | null) =>
    value ? enumAssetLabel(enumType, value) : t("content.basics.unknown");

  const specSections: SpecSection[] = [
    {
      id: "context",
      titleKey: "content.basics.group.context",
      rows: [
        {
          id: "organizationalLevel",
          label: t("asset.properties.organizationalLevel.label"),
          field: "organizationalLevel",
          value: fmtEnum("organizationalLevel", assetBlock.organisationLevel ?? undefined),
          valueKey: assetBlock.organisationLevel ?? undefined,
        },
        {
          id: "organizationalMaturity",
          label: t("asset.properties.organizationalMaturity.label"),
          field: "organizationalMaturity",
          value: fmtEnum("organizationalMaturity", assetBlock.organizationalMaturity ?? undefined),
          valueKey: assetBlock.organizationalMaturity ?? undefined,
        },
        {
          id: "impacts",
          label: t("asset.properties.impacts.label"),
          field: "impacts",
          value: fmtEnum("impacts", assetBlock.impacts ?? undefined),
          valueKey: assetBlock.impacts ?? undefined,
        },
      ],
    },
    {
      id: "decision",
      titleKey: "content.basics.group.decision",
      rows: [
        {
          id: "decisionType",
          label: t("asset.properties.decisionType.label"),
          field: "decisionType",
          value: fmtEnum("decisionType", assetBlock.decisionType ?? undefined),
          valueKey: assetBlock.decisionType ?? undefined,
        },
        {
          id: "valueStreamStage",
          label: t("asset.properties.valueStreamStage.label"),
          field: "valueStreamStage",
          value: fmtEnum("valueStreamStage", assetBlock.valueStream ?? undefined),
          valueKey: assetBlock.valueStream ?? undefined,
        },
      ],
    },
    {
      id: "assessment",
      titleKey: "content.basics.group.assessment",
      rows: [
        {
          id: "complexityLevel",
          label: t("asset.properties.complexityLevel.label"),
          field: "complexityLevel",
          value: fmtEnum("complexityLevel", assetBlock.complexityLevel ?? undefined),
          valueKey: assetBlock.complexityLevel ?? undefined,
        },
        {
          id: "maturityLevel",
          label: t("asset.properties.maturityLevel.label"),
          field: "maturityLevel",
          value: fmtEnum("maturityLevel", assetBlock.maturityLevel ?? undefined),
          valueKey: assetBlock.maturityLevel ?? undefined,
          tone: "accent",
        },
        {
          id: "cognitiveLoad",
          label: t("asset.properties.cognitiveLoad.label"),
          field: "cognitiveLoad",
          value: fmtEnum("cognitiveLoad", assetBlock.cognitiveLoad ?? undefined),
          valueKey: assetBlock.cognitiveLoad ?? undefined,
          tone: "warning",
        },
      ],
    },
  ];

  const relationLabel = (type: string | null, rel: string | null) => {
    const map: Record<string, Record<string, { de: string; en: string }>> = {
      structure: {
        belongs_to: { de: "gehört zu", en: "belongs to" },
        contains: { de: "enthält", en: "contains" },
      },
      process: {
        blocked_by: { de: "blockiert durch", en: "blocked by" },
        enables: { de: "ermöglicht", en: "enables" },
        influences: { de: "beeinflusst", en: "influences" },
        precedes: { de: "geht voraus", en: "precedes" },
        follows: { de: "folgt", en: "follows" },
      },
      dependency: {
        depends_on: { de: "hängt ab von", en: "depends on" },
        implemented_by: { de: "umgesetzt durch", en: "implemented by" },
        requires: { de: "setzt voraus", en: "requires" },
        provides: { de: "stellt bereit", en: "provides" },
      },
      content: {
        alternative_to: { de: "Alternative zu", en: "alternative to" },
        contradicts: { de: "widerspricht", en: "contradicts" },
        related_to: { de: "verwandt mit", en: "related to" },
        root_cause_of: { de: "Ursache von", en: "root cause of" },
        causes: { de: "verursacht", en: "causes" },
        strengthens: { de: "verstärkt", en: "strengthens" },
        used_by: { de: "genutzt von", en: "used by" },
        weakens: { de: "schwächt", en: "weakens" },
        part_of: { de: "Teil von", en: "part of" },
        example_of: { de: "Beispiel für", en: "example of" },
      },
    };

    const typeKey = (type ?? "content").toLowerCase();
    const relKey = (rel ?? "unknown").toLowerCase();
    const entry = map[typeKey]?.[relKey];
    if (entry) return lang === "de" ? entry.de : entry.en;
    return lang === "de" ? t("content.relations.unknownLabel.de") : t("content.relations.unknownLabel.en");
  };

  const assetName = assetBlock.name ?? assetBlock.slug;

  return (
    <div className="space-y-8 pb-20">
      <ContextActionsBar
        backLabel={t("catalog.detail.referrer.back")}
        copyLabel={t("contextActionsBar.copy")}
        copiedLabel={t("contextActionsBar.copied")}
        contextLabel={t("nav.overview360")}
        contextHref={`${localePrefix}/360`}
        className="mt-4"
      />

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

            <div className="w-full">
              <div className="flex items-start gap-2 mb-3">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{assetBlock.name}</h1>
              </div>
              <div className="space-y-2">
                <p className={cn("text-[15px] text-text-secondary leading-relaxed max-w-3xl", !isDescriptionExpanded && "line-clamp-3")}>
                  {showDescription}
                </p>
                {descriptionHasToggle && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-nexo-aqua hover:text-white transition-colors"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                  >
                    {isDescriptionExpanded ? t("content.hero.showLess") : t("content.hero.showMore")}
                  </button>
                )}
              </div>
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
              className="flex items-center justify-start w-full gap-2 rounded-xl bg-accent-primary px-4 py-3 text-sm font-semibold text-nexo-bg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-primary/90 text-left"
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
            <p className="mt-3 text-left text-xs text-text-muted whitespace-pre-line">{t("content.cta.list")}</p>
          </Card>

          <Card className="flex-1 bg-nexo-surface p-6 duration-200 ease-out">
            <h2 className="text-lg font-display font-semibold text-white">{t("content.info.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t("content.info.body")}</p>
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle className="mb-4 px-1">{t("content.basics.title")}</SectionTitle>

        <Card className="bg-nexo-surface border border-white/10 rounded-2xl p-0 overflow-hidden">
          {/* === KONTEXT === */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/80">{t("content.basics.group.context")}</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted">
                  <span>{t("asset.properties.organizationalLevel.label")}</span>
                  <ExplainableLabel fieldKey="organizationalLevel" value={assetBlock.organisationLevel ?? undefined}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-text-muted hover:border-white/40 hover:text-white transition-colors">
                      i
                    </span>
                  </ExplainableLabel>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-sm font-medium text-white">
                  {fmtEnum("organizationalLevel", assetBlock.organisationLevel)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted">
                  <span>{t("asset.properties.organizationalMaturity.label")}</span>
                  <ExplainableLabel fieldKey="organizationalMaturity" value={assetBlock.organizationalMaturity ?? undefined}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-text-muted hover:border-white/40 hover:text-white transition-colors">
                      i
                    </span>
                  </ExplainableLabel>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-sm font-medium text-white">
                  {fmtEnum("organizationalMaturity", assetBlock.organizationalMaturity)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted">
                  <span>{t("asset.properties.impacts.label")}</span>
                  <ExplainableLabel fieldKey="impacts" value={assetBlock.impacts ?? undefined}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-text-muted hover:border-white/40 hover:text-white transition-colors">
                      i
                    </span>
                  </ExplainableLabel>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-sm font-medium text-white">
                  {fmtEnum("impacts", assetBlock.impacts)}
                </div>
              </div>
            </div>
          </div>

          {/* === ENTSCHEIDUNG === */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/80">{t("content.basics.group.decision")}</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted">
                  <span>{t("asset.properties.decisionType.label")}</span>
                  <ExplainableLabel fieldKey="decisionType" value={assetBlock.decisionType ?? undefined}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-text-muted hover:border-white/40 hover:text-white transition-colors">
                      i
                    </span>
                  </ExplainableLabel>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-sm font-medium text-white">
                  {fmtEnum("decisionType", assetBlock.decisionType)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted">
                  <span>{t("asset.properties.valueStreamStage.label")}</span>
                  <ExplainableLabel fieldKey="valueStreamStage" value={assetBlock.valueStream ?? undefined}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-text-muted hover:border-white/40 hover:text-white transition-colors">
                      i
                    </span>
                  </ExplainableLabel>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-sm font-medium text-white">
                  {fmtEnum("valueStreamStage", assetBlock.valueStream)}
                </div>
              </div>
            </div>
          </div>

          {/* === EINSCHÄTZUNG === */}
          <div className="px-6 py-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/80">{t("content.basics.group.assessment")}</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted">
                  <span>{t("asset.properties.complexityLevel.label")}</span>
                  <ExplainableLabel fieldKey="complexityLevel" value={assetBlock.complexityLevel ?? undefined}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-text-muted hover:border-white/40 hover:text-white transition-colors">
                      i
                    </span>
                  </ExplainableLabel>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-sm font-medium text-white">
                  {fmtEnum("complexityLevel", assetBlock.complexityLevel)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted">
                  <span>{t("asset.properties.maturityLevel.label")}</span>
                  <ExplainableLabel fieldKey="maturityLevel" value={assetBlock.maturityLevel ?? undefined}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-text-muted hover:border-white/40 hover:text-white transition-colors">
                      i
                    </span>
                  </ExplainableLabel>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-sm font-medium text-text-secondary">
                  {fmtEnum("maturityLevel", assetBlock.maturityLevel)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-text-muted">
                  <span>{t("asset.properties.cognitiveLoad.label")}</span>
                  <ExplainableLabel fieldKey="cognitiveLoad" value={assetBlock.cognitiveLoad ?? undefined}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-text-muted hover:border-white/40 hover:text-white transition-colors">
                      i
                    </span>
                  </ExplainableLabel>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-sm font-medium text-text-secondary">
                  {fmtEnum("cognitiveLoad", assetBlock.cognitiveLoad)}
                </div>
              </div>
            </div>
          </div>
        </Card>
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
                {structure.paths.map((item, idx) => {
                  const tags = item.segment.tags ? sortTags(item.segment.tags, item.segment.tagOrder).slice(0, 2) : [];
                  return (
                    <HoverCardLink key={`${item.segment.slug}-${idx}`} href={`/${lang}/catalog`} className="p-3">
                      <div className="flex flex-col gap-3">
                        {/* Themenraum */}
                        <div className="flex items-baseline gap-4">
                          <div className="w-32 shrink-0 text-[11px] uppercase tracking-wider text-text-muted/70">
                            {t("content.structure.labels.themeSpace")}
                          </div>
                          <div className="min-w-0 flex-1 text-sm font-semibold text-white wrap-break-word">{item.macroCluster.name}</div>
                        </div>

                        {/* Themenbereich */}
                        <div className="flex items-baseline gap-4">
                          <div className="w-32 shrink-0 text-[11px] uppercase tracking-wider text-text-muted/70">
                            {t("content.structure.labels.themeArea")}
                          </div>
                          <div className="min-w-0 flex-1 text-sm font-semibold text-white wrap-break-word">{item.cluster.name}</div>
                        </div>

                        {/* Segment */}
                        <div className="flex items-baseline gap-4">
                          <div className="w-32 shrink-0 text-[11px] uppercase tracking-wider text-text-muted/70">
                            {t("content.structure.labels.segment")}
                          </div>
                          <div className="min-w-0 flex-1 text-sm font-semibold text-white wrap-break-word">{item.segment.name}</div>
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {tags.map((tag) => (
                              <span
                                key={tag.slug}
                                className="inline-flex rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-text-secondary"
                              >
                                #{tag.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </HoverCardLink>
                  );
                })}
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
              <div className="space-y-4">
                {Object.entries(
                  relations.items.reduce<Record<string, typeof relations.items>>((acc, item) => {
                    const label = relationLabel(item.type, item.relation);
                    (acc[label] ||= []).push(item);
                    return acc;
                  }, {})
                )
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([label, items]) => (
                    <div key={label} className="rel-group">
                      <div className="mb-2 flex items-baseline gap-2">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-text-muted/60">{label}</div>
                        <div className="text-[10px] text-text-muted/40">({items.length})</div>
                      </div>

                      <div className="space-y-2">
                        {items.map((relation) => (
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
                                  <div className="truncate text-[11px] text-text-muted">{t(`asset.enums.types.${relation.node.type}.label`)}</div>
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
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
