"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/atoms/Badge";
import { Button } from "@/components/ui/atoms/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { useI18n } from "@/features/i18n/I18nProvider";

const INITIAL_VISIBLE_COUNT = 6;

type AbstractionLevel = "FOUNDATIONAL" | "STRUCTURAL" | "ATOMIC";

type DecisionHint = {
  label: string;
  value: string;
};

type Overview360Item = {
  id: string;
  title: string;
  description: string;
  slug: string;
  catalogType: "concept" | "method" | "tool" | "technology";
  abstractionLevel: AbstractionLevel;
  decisionHints: DecisionHint[];
  searchHints: string[];
  has360: boolean;
};

const sectionOrder: { level: AbstractionLevel; key: "foundational" | "structural" | "atomic" }[] = [
  { level: "FOUNDATIONAL", key: "foundational" },
  { level: "STRUCTURAL", key: "structural" },
  { level: "ATOMIC", key: "atomic" },
];

const abstractionLabel = (level: AbstractionLevel) => level;

const buildMockItems = (t: (key: string) => string): Overview360Item[] => [
  {
    id: "ddd",
    title: t("overview360.items.ddd.title"),
    description: t("overview360.items.ddd.description"),
    slug: "domain-driven-design",
    catalogType: "concept",
    abstractionLevel: "FOUNDATIONAL",
    decisionHints: [
      { label: t("overview360.meta.decisionType"), value: t("overview360.metaValues.decisionType.design") },
      { label: t("overview360.meta.cognitiveLoad"), value: t("overview360.metaValues.cognitiveLoad.high") },
    ],
    searchHints: ["ddd", "domain driven design", "domain-driven design", "bounded context"],
    has360: true,
  },
  {
    id: "12-factor",
    title: t("overview360.items.twelveFactor.title"),
    description: t("overview360.items.twelveFactor.description"),
    slug: "12-factor-app",
    catalogType: "method",
    abstractionLevel: "FOUNDATIONAL",
    decisionHints: [
      { label: t("overview360.meta.decisionType"), value: t("overview360.metaValues.decisionType.technical") },
      { label: t("overview360.meta.maturity"), value: t("overview360.metaValues.maturity.established") },
    ],
    searchHints: ["12-factor", "12 factor", "twelve factor", "cloud native"],
    has360: true,
  },
  {
    id: "microservices",
    title: t("overview360.items.microservices.title"),
    description: t("overview360.items.microservices.description"),
    slug: "microservices",
    catalogType: "concept",
    abstractionLevel: "STRUCTURAL",
    decisionHints: [
      { label: t("overview360.meta.decisionType"), value: t("overview360.metaValues.decisionType.architecture") },
      { label: t("overview360.meta.cognitiveLoad"), value: t("overview360.metaValues.cognitiveLoad.high") },
    ],
    searchHints: ["microservices", "service architecture", "distributed systems"],
    has360: true,
  },
  {
    id: "event-storming",
    title: t("overview360.items.eventStorming.title"),
    description: t("overview360.items.eventStorming.description"),
    slug: "event-storming",
    catalogType: "method",
    abstractionLevel: "STRUCTURAL",
    decisionHints: [
      { label: t("overview360.meta.decisionType"), value: t("overview360.metaValues.decisionType.organization") },
      { label: t("overview360.meta.maturity"), value: t("overview360.metaValues.maturity.emerging") },
    ],
    searchHints: ["event storming", "domain discovery", "workshop"],
    has360: true,
  },
  {
    id: "circuit-breaker",
    title: t("overview360.items.circuitBreaker.title"),
    description: t("overview360.items.circuitBreaker.description"),
    slug: "circuit-breaker",
    catalogType: "method",
    abstractionLevel: "STRUCTURAL",
    decisionHints: [
      { label: t("overview360.meta.decisionType"), value: t("overview360.metaValues.decisionType.technical") },
      { label: t("overview360.meta.maturity"), value: t("overview360.metaValues.maturity.advanced") },
    ],
    searchHints: ["circuit breaker", "resilience", "fault tolerance"],
    has360: true,
  },
  {
    id: "kubernetes",
    title: t("overview360.items.kubernetes.title"),
    description: t("overview360.items.kubernetes.description"),
    slug: "kubernetes",
    catalogType: "technology",
    abstractionLevel: "ATOMIC",
    decisionHints: [
      { label: t("overview360.meta.decisionType"), value: t("overview360.metaValues.decisionType.technical") },
      { label: t("overview360.meta.cognitiveLoad"), value: t("overview360.metaValues.cognitiveLoad.high") },
    ],
    searchHints: ["kubernetes", "k8s", "orchestration"],
    has360: true,
  },
];

export function Overview360Template() {
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<AbstractionLevel, boolean>>({
    FOUNDATIONAL: false,
    STRUCTURAL: false,
    ATOMIC: false,
  });
  const { t, lang } = useI18n();
  const router = useRouter();
  const localePrefix = lang ? `/${lang}` : "";

  const items = useMemo(() => buildMockItems(t), [t]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;

    return items.filter((item) => {
      const fields = [item.title, item.description, item.abstractionLevel, ...item.searchHints, ...item.decisionHints.map((hint) => hint.value)];
      return fields.some((field) => field.toLowerCase().includes(term));
    });
  }, [items, search]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        acc[item.abstractionLevel].push(item);
        return acc;
      },
      {
        FOUNDATIONAL: [] as Overview360Item[],
        STRUCTURAL: [] as Overview360Item[],
        ATOMIC: [] as Overview360Item[],
      }
    );
  }, [filteredItems]);

  const hasResults = filteredItems.length > 0;

  return (
    <div className="space-y-10 pb-16">
      <header className="space-y-6">
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none md:block">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px),radial-gradient(120%_80%_at_85%_20%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(110%_70%_at_70%_55%,rgba(255,255,255,0.07),transparent_75%)] bg-size-[26px_26px] mask-[linear-gradient(90deg,transparent_0%,transparent_18%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,1)_70%,rgba(0,0,0,1)_100%)]" />
            <div className="absolute inset-0 opacity-22 bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_55%)]" />
          </div>
          <div className="relative z-10">
            <SectionTitle
              badge={t("overview360.hero.badge")}
              title={t("overview360.hero.title")}
              description={t("overview360.hero.subtitle")}
              className="mb-0"
            />
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("overview360.comparison.catalogLabel")}</span>
            <p className="text-sm text-slate-200/80 leading-relaxed">{t("overview360.comparison.catalogDescription")}</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("overview360.comparison.overviewLabel")}</span>
            <p className="text-sm text-slate-200/80 leading-relaxed">{t("overview360.comparison.overviewDescription")}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 h-11">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-slate-300">
              <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
              <path strokeWidth="1.5" d="m16.5 16.5 3 3" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("overview360.search.placeholder")}
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {!hasResults ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-200">
          <p className="text-sm font-semibold text-slate-100">{t("overview360.empty.title")}</p>
          <p className="mt-2 text-sm text-slate-200/80">{t("overview360.empty.description")}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sectionOrder.map((section) => {
            const sectionItems = groupedItems[section.level];
            const isExpanded = expandedSections[section.level];
            const visibleItems = isExpanded ? sectionItems : sectionItems.slice(0, INITIAL_VISIBLE_COUNT);
            const showMore = sectionItems.length > INITIAL_VISIBLE_COUNT && !isExpanded;

            return (
              <section key={section.level} className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white md:text-2xl">{t(`overview360.sections.${section.key}.title`)}</h2>
                    <p className="max-w-2xl text-sm text-slate-200/70 leading-relaxed">
                      {t(`overview360.sections.${section.key}.description`)}
                    </p>
                  </div>
                  {showMore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start md:self-auto text-slate-300 hover:text-white"
                      onClick={() =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          [section.level]: true,
                        }))
                      }
                    >
                      {t("overview360.actions.showMore")}
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleItems.map((item) => (
                    <Card key={item.id} className="flex h-full flex-col">
                      <CardHeader className="space-y-3">
                        <Badge variant="outline" size="sm" radius="full" className="text-slate-300 border-white/15 bg-white/5">
                          {abstractionLabel(item.abstractionLevel)}
                        </Badge>
                        <CardTitle className="group-hover:text-white">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-slate-200/80 leading-relaxed line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.decisionHints.map((hint) => (
                            <span
                              key={`${item.id}-${hint.label}-${hint.value}`}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200/80"
                            >
                              {hint.label}: <span className="text-slate-100">{hint.value}</span>
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => router.push(`${localePrefix}/content/${item.catalogType}/${item.slug}`)}
                        >
                          {t("overview360.actions.view360")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => router.push(`${localePrefix}/catalog/${item.catalogType}/${item.slug}`)}
                        >
                          {t("overview360.actions.openCatalog")}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
