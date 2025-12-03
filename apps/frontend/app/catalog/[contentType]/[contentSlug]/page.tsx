import { fetchCatalog, fetchCatalogItemById } from "@/lib/api/catalog";
import type { CatalogContentType, CatalogItem } from "@/types/catalog";
import { notFound } from "next/navigation";
import { ReferrerNav } from "./ReferrerNav";

type PageProps = {
  params: Promise<{ contentType: CatalogContentType; contentSlug: string }> | { contentType: CatalogContentType; contentSlug: string };
};

type AnyRecord = Record<string, any>;

const typeStyles: Record<CatalogContentType, string> = {
  method: "bg-amber-500/15 text-amber-100 border border-amber-400/30",
  concept: "bg-sky-500/15 text-sky-100 border border-sky-400/30",
  tool: "bg-emerald-500/15 text-emerald-100 border border-emerald-400/30",
  technology: "bg-fuchsia-500/15 text-fuchsia-100 border border-fuchsia-400/30",
};

function safeArray(value: unknown): any[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function safeObjectArray(value: unknown): AnyRecord[] {
  const arr = safeArray(value);
  return arr.filter((item) => item && typeof item === "object");
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { contentType, contentSlug } = await params;

  const catalog = await fetchCatalog();
  const items = catalog.data?.items ?? [];
  const match = items.find((it) => it.slug === contentSlug && (it.type?.toString().toLowerCase() ?? "") === contentType);
  if (!match?.id) return notFound();

  const item = (await fetchCatalogItemById(match.id)) as CatalogItem | null;
  if (!item) return notFound();

  const parsed = {
    tags: safeArray(item.tags) as string[],
    principles: safeArray((item as AnyRecord).principles) as string[],
    goals: safeArray((item as AnyRecord).goals) as string[],
    organizationalLevel: safeArray((item as AnyRecord).organizationalLevel) as string[],
    useCases: safeObjectArray((item as AnyRecord).useCases),
    scenarios: safeObjectArray((item as AnyRecord).scenarios),
    examples: safeObjectArray((item as AnyRecord).examples),
    risks: safeArray((item as AnyRecord).risks) as string[],
    traps: safeArray((item as AnyRecord).traps) as string[],
    antiPatterns: safeArray((item as AnyRecord).antiPatterns) as string[],
    bestPractices: safeArray((item as AnyRecord).bestPractices) as string[],
    inputs: safeArray((item as AnyRecord).inputs) as string[],
    outputs: safeArray((item as AnyRecord).outputs) as string[],
    resources: safeObjectArray((item as AnyRecord).resources),
    metrics: safeObjectArray((item as AnyRecord).metrics),
    constraints: safeArray((item as AnyRecord).constraints) as string[],
    integrations: safeArray((item as AnyRecord).integration ?? (item as AnyRecord).integrations) as string[],
    technologies: safeArray((item as AnyRecord).technologies) as string[],
    platforms: safeArray((item as AnyRecord).platforms) as string[],
    valueStreamStage: (item as AnyRecord).valueStreamStage as string | undefined,
    architecturalDrivers: safeArray((item as AnyRecord).architecturalDrivers) as string[],
    benefits: safeArray((item as AnyRecord).benefits) as string[],
    limitations: safeArray((item as AnyRecord).limitations) as string[],
    implementationSteps: safeArray((item as AnyRecord).implementationSteps) as string[],
    techDebts: safeArray((item as AnyRecord).techDebts) as string[],
    bottleneckTags: safeArray((item as AnyRecord).bottleneckTags) as string[],
    misuseExamples: safeArray((item as AnyRecord).misuseExamples) as string[],
    requiredSkills: safeArray((item as AnyRecord).requiredSkills) as string[],
    tradeoffMatrix: safeObjectArray((item as AnyRecord).tradeoffMatrix),
  };

  const heroQuote =
    item.longDescription || (parsed.principles.length ? parsed.principles[0] : undefined) || (parsed.goals.length ? parsed.goals[0] : undefined);

  const metaChips = [
    { label: "Reifegrad", value: (item as AnyRecord).maturityLevel },
    { label: "Cognitive Load", value: (item as AnyRecord).cognitiveLoad },
    { label: "Status", value: (item as AnyRecord).status },
  ].filter((m) => m.value);

  const gridCards: { title: string; items: { label: string; value?: any; list?: string[] }[] }[] = [
    {
      title: "Klassifikation",
      items: [
        { label: "Komplexität", value: (item as AnyRecord).complexityLevel },
        { label: "Impact", value: (item as AnyRecord).impact },
        { label: "Decision Type", value: (item as AnyRecord).decisionType },
        { label: "Org Maturity", value: (item as AnyRecord).organizationalMaturity },
        { label: "Organizational Level", list: parsed.organizationalLevel as string[] },
      ],
    },
    {
      title: "Technischer Kontext",
      items: [
        { label: "Integrationen", list: parsed.integrations as string[] },
        { label: "Technologien", list: parsed.technologies as string[] },
        { label: "Plattformen", list: parsed.platforms as string[] },
        { label: "Value Stream Stage", value: parsed.valueStreamStage },
        { label: "Drivers", list: parsed.architecturalDrivers as string[] },
      ],
    },
    {
      title: "Prinzipien & Ziele",
      items: [
        { label: "Prinzipien", list: parsed.principles as string[] },
        { label: "Ziele", list: parsed.goals as string[] },
      ],
    },
    {
      title: "Use Cases & Szenarien",
      items: [
        { label: "Use Cases", value: parsed.useCases },
        { label: "Szenarien", value: parsed.scenarios },
        { label: "Beispiele", value: parsed.examples },
      ],
    },
    {
      title: "Trade-offs",
      items: [
        { label: "Risiken", list: parsed.risks as string[] },
        { label: "Fallen", list: parsed.traps as string[] },
        { label: "Anti-Patterns", list: parsed.antiPatterns as string[] },
        { label: "Best Practices", list: parsed.bestPractices as string[] },
      ],
    },
    {
      title: "I/O & Ressourcen",
      items: [
        { label: "Inputs", list: parsed.inputs as string[] },
        { label: "Outputs", list: parsed.outputs as string[] },
        { label: "Ressourcen", value: parsed.resources },
        { label: "Metriken", value: parsed.metrics },
        { label: "Constraints", list: parsed.constraints as string[] },
      ],
    },
  ];

  const listBadge = (content: string, key: string) => (
    <span key={key} className="inline-flex items-center rounded-full bg-[#101827] px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/5">
      {content}
    </span>
  );

  const renderValue = (value: any) => {
    if (!value) return <span className="text-sm text-slate-500">N/A</span>;
    if (Array.isArray(value)) {
      if (!value.length) return <span className="text-sm text-slate-500">N/A</span>;
      return <div className="flex flex-wrap gap-2">{value.map((v, idx) => listBadge(String(v), `${String(v)}-${idx}`))}</div>;
    }
    if (typeof value === "string") return <span className="text-sm text-slate-100">{value}</span>;
    if (typeof value === "object") {
      const entries = Object.entries(value as AnyRecord);
      return (
        <div className="flex flex-col gap-1 text-sm text-slate-100">
          {entries.map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="text-slate-500">{k}:</span>
              <span>{typeof v === "string" ? v : JSON.stringify(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-sm text-slate-100">{String(value)}</span>;
  };

  const renderObjArray = (value: AnyRecord[], key: string) => {
    if (!value.length) return <span className="text-sm text-slate-500">N/A</span>;
    return (
      <div className="space-y-2">
        {value.map((obj, idx) => (
          <div key={`${key}-${idx}`} className="rounded-xl border border-white/5 bg-[#101827] px-3 py-2 text-sm text-slate-100">
            {Object.entries(obj).map(([k, v]) => (
              <div key={k} className="flex gap-2 text-xs text-slate-200">
                <span className="text-slate-500">{k}:</span>
                <span>{typeof v === "string" ? v : JSON.stringify(v)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <ReferrerNav segmentName={item.segmentName} clusterName={item.clusterName} macroClusterName={item.macroClusterName} />

      {/* Hero */}
      <section className="rounded-3xl border border-white/12 bg-gradient-to-br from-[#0F172A] via-[#0d1430] to-[#0b1226] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.4)] lg:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${typeStyles[contentType]}`}
              >
                {contentType}
              </span>
              {parsed.tags.slice(0, 8).map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-flex items-center rounded-full bg-[#111c35] px-3 py-1 text-[11px] font-semibold text-slate-100 ring-1 ring-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {(item as AnyRecord).icon && (
                <span className="text-3xl" aria-hidden>
                  {(item as AnyRecord).icon}
                </span>
              )}
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{item.name}</h1>
            </div>
            {item.shortDescription && <p className="text-base leading-relaxed text-slate-200/90">{item.shortDescription}</p>}
            {heroQuote && (
              <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-4 text-sm text-slate-200 shadow-inner shadow-black/30">
                <p className="italic leading-relaxed text-slate-100">“{heroQuote}”</p>
              </div>
            )}
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-white/10 bg-[#0B1220] p-4">
            <div className="flex flex-wrap gap-2">
              {metaChips.length === 0 && <span className="text-xs text-slate-500">Keine Meta-Infos</span>}
              {metaChips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center rounded-full bg-[#111C3A] px-3 py-1 text-[11px] font-semibold text-slate-100 ring-1 ring-white/10"
                >
                  {chip.label}: {chip.value}
                </span>
              ))}
            </div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-slate-400">Meta</h3>
            <div className="flex flex-col gap-1 text-sm text-slate-200">
              <span>
                Segment: <span className="text-slate-100">{item.segmentName ?? "—"}</span>
              </span>
              <span>
                Cluster: <span className="text-slate-100">{item.clusterName ?? "—"}</span>
              </span>
              <span>
                Macro: <span className="text-slate-100">{item.macroClusterName ?? "—"}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gridCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-[0_10px_25px_rgba(0,0,0,0.28)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.12em]">{card.title}</h3>
            </div>
            <div className="space-y-3 text-sm">
              {card.items.map((entry, idx) => (
                <div key={`${card.title}-${idx}`} className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">{entry.label}</p>
                  {entry.list
                    ? renderValue(entry.list)
                    : Array.isArray(entry.value) && entry.value.length && typeof entry.value[0] === "object"
                      ? renderObjArray(entry.value as AnyRecord[], `${card.title}-${idx}`)
                      : renderValue(entry.value)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Detail content */}
      <section className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-white border-l-4 border-[#5EE0FF] pl-3">Beschreibung</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">
            {item.longDescription || item.shortDescription || "Keine Beschreibung vorhanden."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CardList title="Benefits" items={parsed.benefits} />
          <CardList title="Limitations" items={parsed.limitations} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CardList title="Implementation Steps" items={parsed.implementationSteps} />
          <CardList
            title="Technische Schulden & Engpässe"
            items={[...parsed.techDebts, ...parsed.bottleneckTags, ...parsed.misuseExamples, ...parsed.risks]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CardList title="Required Skills" items={parsed.requiredSkills} />
          <CardList title="Architectural Drivers" items={parsed.architecturalDrivers} />
          <CardList title="Constraints" items={parsed.constraints} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CardObjectList title="Use Cases" items={parsed.useCases} />
          <CardObjectList title="Szenarien" items={parsed.scenarios} />
          <CardObjectList title="Beispiele & Implementierungen" items={parsed.examples} />
          <CardObjectList title="Trade-off Matrix" items={parsed.tradeoffMatrix} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CardObjectList title="Ressourcen" items={parsed.resources} />
          <CardObjectList title="Metriken" items={parsed.metrics} />
        </div>
      </section>
    </>
  );
}

type CardListProps = { title: string; items: string[] };
function CardList({ title, items }: CardListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4">
        <h3 className="text-sm font-semibold text-white border-l-2 border-white/15 pl-2">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">Keine Angaben.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4">
      <h3 className="text-sm font-semibold text-white border-l-2 border-white/15 pl-2">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((it, idx) => (
          <span
            key={`${title}-${it}-${idx}`}
            className="rounded-full bg-[#101827] px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

type CardObjectListProps = { title: string; items: AnyRecord[] };
function CardObjectList({ title, items }: CardObjectListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4">
        <h3 className="text-sm font-semibold text-white border-l-2 border-white/15 pl-2">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">Keine Angaben.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0F172A] p-4">
      <h3 className="text-sm font-semibold text-white border-l-2 border-white/15 pl-2">{title}</h3>
      {items.map((obj, idx) => (
        <div
          key={`${title}-${idx}`}
          className="rounded-xl border border-white/5 bg-[#101827] px-3 py-2 text-sm text-slate-100"
          suppressHydrationWarning
        >
          {Object.entries(obj).map(([k, v]) => (
            <div key={k} className="flex gap-2 text-xs text-slate-200">
              <span className="text-slate-500">{k}:</span>
              <span>{typeof v === "string" ? v : JSON.stringify(v)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
