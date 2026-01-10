"use client";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { ExplainableLabel } from "@/components/atoms/ExplainableLabel";
import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TagChip } from "@/components/atoms/TagChip";
import { useEnumAssetLabel, useEnumAssetLabels, useI18n } from "@/features/i18n/I18nProvider";
import { ContentDetail } from "@/types/catalog";
import { Example, ExternalResource } from "@/types/nexonoma";
import { getCardTagLabel, getOrderedTagKeys } from "@/utils/getCardTags";
import { Info } from "lucide-react";
import { MetricsList } from "../organisms/MetricsList";
import ReferrerNavClient from "../organisms/ReferrerNavClient";
import { ScenarioList } from "../organisms/ScenarioList";
import { TradeoffMatrix } from "../organisms/TradeoffMatrix";
import { UseCaseList } from "../organisms/UseCaseList";

interface ContentDetailsTemplateProps {
  // Wir nutzen FullAsset.
  // Da die API vielleicht nicht 100% matcht, können wir Partial nutzen
  // oder sicherstellen, dass der Mapper das korrekte Objekt baut.
  content: ContentDetail;

  // UI-Overrides falls nötig
  icon?: string;
  heroQuote?: string;
  contentType: string;
}

// --- HELPER COMPONENT (Für das Bento Grid Design) ---
const InfoCard = ({
  title,
  iconColor,
  stripeColorClass,
  children,
}: {
  title: string;
  iconColor: string;
  stripeColorClass: string;
  children: React.ReactNode;
}) => (
  <div className="bg-nexo-card rounded-2xl border border-nexo-border p-6 shadow-sm hover:border-slate-600 transition relative overflow-hidden group">
    <div className={`absolute top-0 left-0 w-full h-0.5 ${stripeColorClass}`}></div>
    <div className="flex items-center gap-2 mb-4">
      <svg className={`w-5 h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export function ContentDetailsTemplate({ contentType, icon, heroQuote, content }: ContentDetailsTemplateProps) {
  const { t, lang } = useI18n();
  const enumLabel = useEnumAssetLabel();
  const enumLabels = useEnumAssetLabels();
  const tagKeys = getOrderedTagKeys(content);

  return (
    <div className="space-y-8 pb-20">
      {/* 0. Navigation */}
      <ReferrerNavClient segmentName={content.segmentName} clusterName={content.clusterName} macroClusterName={content.macroClusterName} />

      {/* 1. HERO SECTION */}
      <section className="relative bg-nexo-card rounded-2xl border border-nexo-border p-8 shadow-card overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-nexo-aqua/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={getBadgeVariant(contentType)}
                size="md"
                radius="md" // <-- Der Tech-Look
              >
                {contentType}
              </Badge>
              {tagKeys.map((key) => {
                const label = getCardTagLabel(content, key, lang);
                return <TagChip key={key} variant="detail" label={`#${label}`} title={label} />;
              })}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <DynamicIcon name={icon} className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground shrink-0" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-0!">{content.name}</h1>
              </div>
              <p className="text-lg text-nexo-muted font-light leading-relaxed">{content.shortDescription}</p>
            </div>
            {heroQuote && <div className="pt-2 text-sm text-slate-400 max-w-2xl border-l-2 border-nexo-aqua/30 pl-4 italic">{heroQuote}</div>}
          </div>

          <div className="flex flex-row flex-wrap md:flex-col items-start md:items-end gap-3 min-w-[200px]">
            <div className="flex w-full md:justify-end">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-200/80 hover:text-slate-100 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexo-ocean/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950/60"
                  >
                    <Info className="h-4 w-4" />
                    <span>{t("contentDetails.explain.trigger")}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-[420px] max-w-[90vw] border border-nexo-border bg-slate-950/90 shadow-lg"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">{t("contentDetails.explain.title")}</p>
                    <p className="text-sm text-slate-400">{t("contentDetails.explain.body")}</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <ExplainableLabel fieldKey="maturityLevel" value={content.maturityLevel}>
                <span className="text-xs uppercase font-semibold text-slate-500">{t("asset.properties.maturityLevel.label")}</span>
              </ExplainableLabel>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span>
                <span className="text-sm text-white font-medium">{t(enumLabel("maturityLevel", content.maturityLevel))}</span>
              </div>
            </div>
            {content.cognitiveLoad && (
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <ExplainableLabel fieldKey="cognitiveLoad" value={content.cognitiveLoad}>
                  <span className="text-xs text-slate-500 uppercase font-semibold">{t("asset.properties.cognitiveLoad.label")}</span>
                </ExplainableLabel>
                <span className="text-sm text-red-400 font-medium">{t(enumLabel("cognitiveLoad", content.cognitiveLoad))}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. BENTO GRID (Key Information) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1: Klassifikation */}
        <InfoCard
          title={t("catalog.detail.cards.classification.title")}
          iconColor="text-purple-400"
          stripeColorClass="bg-linear-to-r from-purple-500 to-indigo-500"
        >
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <ExplainableLabel fieldKey="complexityLevel" value={content.complexityLevel}>
                <span className="text-slate-500">{t("asset.properties.complexityLevel.label")}</span>
              </ExplainableLabel>
              <span className="text-red-400">{t(enumLabel("complexityLevel", content.complexityLevel))}</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <ExplainableLabel fieldKey="impacts" value={content.decisionType}>
                <span className="text-slate-500">{t("asset.properties.impacts.label")}</span>
              </ExplainableLabel>
              <span className="text-slate-200">{t(enumLabel("impacts", content.impacts))}</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <ExplainableLabel fieldKey="decisionType" value={content.decisionType}>
                <span className="text-slate-500">{t("asset.properties.decisionType.label")}</span>
              </ExplainableLabel>
              <span className="text-slate-200">{t(enumLabel("decisionType", content.decisionType))}</span>
            </li>
            <li className="flex justify-between pt-1">
              <ExplainableLabel fieldKey="organizationalMaturity" value={content.organizationalMaturity}>
                <span className="text-slate-500">{t("asset.properties.organizationalMaturity.label")}</span>
              </ExplainableLabel>
              <span className="text-slate-200">{t(enumLabel("organizationalMaturity", content.organizationalMaturity))}</span>
            </li>
          </ul>
        </InfoCard>

        {/* CARD 2: Technisch */}
        <InfoCard
          title={t("catalog.detail.cards.technical.title")}
          iconColor="text-nexo-aqua"
          stripeColorClass="bg-linear-to-r from-nexo-aqua to-nexo-ocean"
        >
          <div className="space-y-4">
            <div>
              <ExplainableLabel fieldKey="integrations">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 block">
                  {t("asset.properties.integrations.label")}
                </span>
              </ExplainableLabel>
              <div className="flex flex-wrap gap-2 pt-2">
                {content.integrations?.map((integ: string, idx: number) => (
                  <Badge key={`${integ}-${idx}`} variant="outline" size="md" radius="md" className="font-normal">
                    {integ}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </InfoCard>

        {/* CARD 3: Prinzipien */}
        <InfoCard title={t("catalog.detail.cards.principles.title")} iconColor="text-slate-400" stripeColorClass="bg-slate-600">
          <ExplainableLabel fieldKey="principles">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 block">{t("asset.properties.principles.label")}</span>
          </ExplainableLabel>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {content.principles?.map((principle: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-slate-800/60 rounded text-xs border border-slate-700">
                  {principle}
                </span>
              ))}
            </div>
            <div className="text-sm text-nexo-muted leading-relaxed mt-2">
              <ExplainableLabel fieldKey="valueStreamStage" value={content.valueStreamStage}>
                <span className="block text-xs text-slate-500 uppercase font-bold mb-1">{t("asset.properties.valueStreamStage.label")}</span>
              </ExplainableLabel>
              <div>
                <span className="text-white">{t(enumLabel("valueStreamStage", content.valueStreamStage))}</span>
              </div>
            </div>
            <div className="text-sm text-nexo-muted leading-relaxed">
              <ExplainableLabel fieldKey="organizationalLevel">
                <span className="block text-xs text-slate-500 uppercase font-bold mb-1">{t("asset.properties.organizationalLevel.label")}</span>
              </ExplainableLabel>
              <div>
                <span className="text-white">{t(enumLabels("organizationalLevel", content.organizationalLevel))}</span>
              </div>
            </div>
          </div>
        </InfoCard>

        {/* CARD 4: Use Cases & Scenarios */}
        <InfoCard title={t("catalog.detail.cards.useCases.title")} iconColor="text-blue-400" stripeColorClass="bg-blue-500">
          <div className="space-y-4">
            {content.useCases?.length > 0 && (
              <div className="space-y-2">
                <ExplainableLabel fieldKey="useCases">
                  <span className="text-[10px] uppercase text-blue-400 font-bold">{t("asset.properties.useCases.label")}</span>
                </ExplainableLabel>

                {<UseCaseList useCases={content.useCases} />}
              </div>
            )}
            {content.scenarios?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <ExplainableLabel fieldKey="scenarios">
                  <span className="text-[10px] uppercase text-green-400 font-bold">{t("asset.properties.scenarios.label")}</span>
                </ExplainableLabel>

                <ScenarioList scenarios={content.scenarios} />
              </div>
            )}
          </div>
        </InfoCard>

        {/* CARD 5: Kompromisse */}
        <InfoCard
          title={t("catalog.detail.cards.compromises.title")}
          iconColor="text-slate-400"
          stripeColorClass="bg-linear-to-r from-red-500 to-green-500"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ExplainableLabel fieldKey="risks">
                <span className="text-[10px] uppercase text-red-400 font-bold mb-2 block tracking-wider">{t("asset.properties.risks.label")}</span>
              </ExplainableLabel>

              <ul className="text-xs text-nexo-muted space-y-2 list-disc list-outside pl-4 marker:text-red-500">
                {content.risks?.map((risk: string, idx: number) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>
            <div>
              <ExplainableLabel fieldKey="risks">
                <span className="text-[10px] uppercase text-green-400 font-bold mb-2 block tracking-wider">
                  {t("asset.properties.bestPractices.label")}
                </span>
              </ExplainableLabel>
              <ul className="text-xs text-nexo-muted space-y-2 list-disc list-outside pl-4 marker:text-green-500">
                {content.bestPractices?.map((bp: string, idx: number) => (
                  <li key={idx}>{bp}</li>
                ))}
              </ul>
            </div>
          </div>
        </InfoCard>

        {/* CARD 6: I/O & Ressourcen */}
        <InfoCard title={t("catalog.detail.cards.io.title")} iconColor="text-indigo-400" stripeColorClass="bg-indigo-500">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <ExplainableLabel fieldKey="inputs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">{t("asset.properties.inputs.label")}</span>
                </ExplainableLabel>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-outside pl-4">
                  {content.inputs?.map((input: string, idx: number) => (
                    <li key={idx}>{input}</li>
                  ))}
                </ul>
              </div>
              <div>
                <ExplainableLabel fieldKey="outputs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">{t("asset.properties.outputs.label")}</span>
                </ExplainableLabel>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-outside pl-4">
                  {content.outputs?.map((output: string, idx: number) => (
                    <li key={idx}>{output}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <ExplainableLabel fieldKey="resources">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-2">{t("asset.properties.resources.label")}</span>
              </ExplainableLabel>

              <ul className="space-y-1.5">
                {content.resources?.map((res: ExternalResource, idx: number) => (
                  <li key={idx}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-nexo-aqua hover:underline inline-flex items-center gap-1"
                    >
                      {res.name}
                      <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </InfoCard>
      </section>

      {/* 3. DETAIL CONTENT AREA */}
      <section className="space-y-10 pt-8 border-t border-white/5">
        {/* Description */}
        <section className="max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-nexo-aqua rounded-full"></span>
            {t("catalog.detail.sections.description.title")}
          </h2>
          <div className="prose prose-invert prose-slate max-w-none text-nexo-muted text-base leading-relaxed">
            <p>{content.longDescription}</p>
          </div>
        </section>

        {/* Pros / Cons */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">✔</span>
              <ExplainableLabel fieldKey="benefits">{t("asset.properties.benefits.label")}</ExplainableLabel>
            </h3>
            <ul className="space-y-2">
              {content.benefits?.map((b: string, idx: number) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">✖</span>
              <ExplainableLabel fieldKey="limitations">{t("asset.properties.limitations.label")}</ExplainableLabel>
            </h3>
            <ul className="space-y-2">
              {content.limitations?.map((l: string, idx: number) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* TradeofMatrix */}
        {/* Abwägungen & Metriken */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* TradeoffMatrix */}
          <section className="">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500/40 rounded-full"></span>
              <ExplainableLabel fieldKey="tradeoffMatrix">{t("asset.properties.tradeoffMatrix.label")}</ExplainableLabel>
            </h2>

            <div className="mt-3">
              <div className="mt-4 rounded-md bg-slate-900/20 p-4 text-sm text-slate-500">
                <TradeoffMatrix
                  items={content.tradeoffMatrix?.map((t) => ({
                    dimension: t.dimension,
                    pros: t.pros,
                    cons: t.cons,
                  }))}
                />
              </div>
            </div>
          </section>

          {/* Metrics */}
          <section className="">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-500/40 rounded-full"></span>
              <ExplainableLabel fieldKey="metrics">{t("asset.properties.metrics.label")}</ExplainableLabel>
            </h2>

            <div className="mt-3">
              <div className="mt-4 rounded-md bg-slate-900/20 p-4 text-sm text-slate-500">
                <MetricsList
                  items={content.metrics?.map((m) => ({
                    name: m.name,
                    description: m.description,
                  }))}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Examples */}
        <section>
          <ExplainableLabel fieldKey="examples">
            <h2 className="text-xl font-bold text-white mb-4">{t("asset.properties.examples.label")} </h2>
          </ExplainableLabel>
          {content.examples?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.examples.map((example: Example, idx: number) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                  <h4 className="font-bold text-white mb-1">{example.name}</h4>
                  <p className="text-sm text-slate-400 mb-2">{example.description}</p>
                  <div className="flex gap-2">
                    {example.assets?.map((asset: string, assetIdx: number) => (
                      <span key={assetIdx} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Implementation Steps */}
        <section className="bg-slate-900/30 border border-slate-800 rounded-xl p-8">
          <ExplainableLabel fieldKey="implementationSteps">
            <h2 className="text-xl font-bold text-white mb-6">{t("asset.properties.implementationSteps.label")}</h2>
          </ExplainableLabel>
          <div className="space-y-6">
            {content.implementationSteps?.map((step: string, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-nexo-ocean/10 text-nexo-ocean font-bold text-sm border border-nexo-ocean/20">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-300 pt-1.5">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Debt (Warning Section) */}
        <section className="bg-red-500/5 border border-red-500/10 rounded-xl p-6">
          <h2 className="text-lg font-bold text-red-200 mb-4 flex items-center gap-2">
            <span className="p-1 rounded ">⚠️</span> {t("catalog.detail.sections.techDebt.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ExplainableLabel fieldKey="techDebts">
                <h5 className="text-xs uppercase text-red-300 font-bold mb-2">{t("asset.properties.techDebts.label")}</h5>
              </ExplainableLabel>

              <ul className="space-y-2">
                {content.techDebts?.map((td: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-400">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                    {td}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ExplainableLabel fieldKey="bottleneckTags">
                <h5 className="text-xs uppercase text-orange-300 font-bold mb-2">{t("catalog.detail.sections.techDebt.bottlenecksLabel")}</h5>{" "}
              </ExplainableLabel>

              <div className="flex flex-wrap gap-2">
                {content.bottleneckTags?.map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-red-900/30 border border-red-800/50 rounded text-xs text-red-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Missuse Examples */}
            {content.misuseExamples?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-red-500/10">
                <ExplainableLabel fieldKey="misuseExamples">
                  <h5 className="text-xs uppercase text-red-300 font-bold mb-2">{t("catalog.detail.sections.techDebt.misuse")}</h5>
                </ExplainableLabel>
                <ul className="text-sm text-slate-400 list-disc list-inside">
                  {content.misuseExamples.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Traps */}
            {content.misuseExamples?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-red-500/10">
                <ExplainableLabel fieldKey="traps">
                  <h5 className="text-xs uppercase text-red-300 font-bold mb-2">{t("catalog.detail.sections.techDebt.traps")}</h5>
                </ExplainableLabel>
                <ul className="text-sm text-slate-400 list-disc list-inside">
                  {content.traps.map((trap, idx) => (
                    <li key={idx}>{trap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Additional Info (Skills, Drivers, Constraints) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 border-t border-slate-800">
          <div>
            <ExplainableLabel fieldKey="requiredSkills">
              <h5 className="text-xs uppercase text-slate-500 font-bold mb-3">{t("asset.properties.requiredSkills.label")}</h5>
            </ExplainableLabel>

            <div className="flex flex-wrap gap-2">
              {content.requiredSkills?.map((skill: string, idx: number) => (
                <Badge key={`${skill}-${idx}`} variant="default" size="md" radius="md" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <ExplainableLabel fieldKey="architecturalDrivers">
              <h5 className="text-xs uppercase text-slate-500 font-bold mb-3">{t("asset.properties.architecturalDrivers.label")}</h5>
            </ExplainableLabel>

            <div className="flex flex-wrap gap-2">
              {content.architecturalDrivers?.map((driver: string, idx: number) => (
                <span key={idx} className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">
                  {driver}
                </span>
              ))}
            </div>
          </div>
          <div>
            <ExplainableLabel fieldKey="constraints">
              <h5 className="text-xs uppercase text-slate-500 font-bold mb-3">{t("asset.properties.constraints.label")}</h5>
            </ExplainableLabel>

            <ul className="text-xs text-nexo-muted space-y-1">
              {content.constraints?.map((constraint: string, idx: number) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-slate-600">•</span> {constraint}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
}
