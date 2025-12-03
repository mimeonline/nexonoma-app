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

function firstSentence(text?: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/[^.!?]*[.!?]/);
  return match ? match[0].trim() : text.trim();
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
    integration: safeArray((item as AnyRecord).integration) as string[],
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
    cognitiveLoad: safeObjectArray((item as AnyRecord).cognitiveLoad),
    status: safeObjectArray((item as AnyRecord).status),
    impact: safeArray((item as AnyRecord).impact) as string[],
    decisionType: safeArray((item as AnyRecord).decisionType) as string[],
    complexityLevel: safeArray((item as AnyRecord).complexityLevel) as string[],
    organizationalMaturity: safeArray((item as AnyRecord).organizationalMaturity) as string[],
  };

  const heroQuote = firstSentence(
    item.longDescription || (parsed.principles.length ? parsed.principles[0] : undefined) || (parsed.goals.length ? parsed.goals[0] : undefined)
  );
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
      {/* HERO SECTION (Full Width Card) */}
      <section className="elative bg-nexo-card rounded-2xl border border-nexo-border p-8 shadow-card overflow-hidden">
        {/* Decorative Gradient Blob */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-nexo-aqua/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          {/* Left Content */}
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {contentType}
              </span>
              <div className="flex gap-2"></div>
              {parsed.tags.slice(0, 8).map((tag, idx) => (
                <span key={`${tag}-${idx}`} className="text-xs text-nexo-muted bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
                  #{tag}
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                {(item as AnyRecord).icon && (
                  <span className="text-3xl" aria-hidden>
                    {(item as AnyRecord).icon}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{item.name}</h1>
              </div>
              <p className="text-lg text-nexo-muted font-light leading-relaxed">{item.shortDescription}</p>
            </div>
            <div className="pt-2 text-sm text-slate-400 max-w-2xl border-l-2 border-nexo-aqua/30 pl-4 italic">{heroQuote}</div>
          </div>
          {/* Right Metadata */}
          <div className="flex md:flex-col items-start md:items-end gap-3 min-w-[200px]">
            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-semibold">Reifegrad</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span>
                <span className="text-sm text-white font-medium">{item.maturityLevel}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-semibold">Kognitive Belastung</span>
              <span className="text-sm text-red-400 font-medium">{item.cognitiveLoad}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-semibold">Status</span>
              <span className="text-sm text-slate-300 font-medium">{item.status}</span>
            </div>
          </div>
        </div>
      </section>
      {/* BENTO GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1: Klassifikation */}
        <div className="bg-nexo-card rounded-2xl border border-nexo-border p-6 shadow-sm hover:border-slate-600 transition group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-purple-500 to-indigo-500"></div>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="font-semibold text-white">Klassifikation</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Komplexität</span>
              <span className="text-red-400">{parsed.complexityLevel}</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Auswirkungsbereich</span>
              <span className="text-slate-200">{parsed.impact}</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Entscheidungstyp</span>
              <span className="text-slate-200">{parsed.decisionType}</span>
            </li>
            <li className="flex justify-between pt-1">
              <span className="text-slate-500">Organisationsreife</span>
              <span className="text-slate-200">{parsed.organizationalMaturity}</span>
            </li>
          </ul>
        </div>
        {/* CARD 2: Technisch  */}
        <div className="bg-nexo-card rounded-2xl border border-nexo-border p-6 shadow-sm hover:border-slate-600 transition relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-nexo-aqua to-nexo-ocean"></div>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-nexo-aqua" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h3 className="font-semibold text-white">Technischer Kontext</h3>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 block">Integrationen</span>
              <div className="flex flex-wrap gap-2">
                {Array.isArray((item as AnyRecord).integration) &&
                  (item as AnyRecord).integration.map((integ: string, idx: number) => (
                    <span key={`integration-${idx}`} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                      {integ}
                    </span>
                  ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 block">Alternativen</span>
              <ul className="text-sm text-slate-300 list-disc list-inside">
                {Array.isArray((item as AnyRecord).alternatives) &&
                  (item as AnyRecord).alternatives.map((alternative: string, idx: number) => (
                    <li key={`alternative-${idx}`} className="mb-1">
                      {alternative}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        {/* CARD 3: Prinzipien (statt Anwendung Text) */}
        <div className="bg-nexo-card rounded-2xl border border-nexo-border p-6 shadow-sm hover:border-slate-600 transition relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-slate-600"></div>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="font-semibold text-white">Prinzipien & Ziele</h3>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {Array.isArray((item as AnyRecord).principles) &&
                (item as AnyRecord).principles.map((principle: string, idx: number) => (
                  <span key={`principle-${idx}`} className="px-2 py-1 bg-slate-800/60 rounded text-xs border border-slate-700">
                    {principle}
                  </span>
                ))}
            </div>
            <p className="text-sm text-nexo-muted leading-relaxed mt-2">
              <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Wertstrom</span>
              Phase: <span className="text-white">{item.valueStreamStage}</span>
            </p>
            <p className="text-sm text-nexo-muted leading-relaxed">
              <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Organisationsebene</span>
              <span className="text-white"> {Array.isArray(item.organizationalLevel) ? item.organizationalLevel.join(", ") : ""}</span>
            </p>
          </div>
        </div>
        {/* ROW 2 START */}
        {/* CARD 4a: Use Cases */}

        <div className="bg-nexo-card rounded-2xl border border-nexo-border p-6 shadow-sm hover:border-slate-600 transition relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500"></div>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-white">Use Cases</h3>
          </div>
          {parsed.useCases.length > 0 && (
            <div className="space-y-3">
              {parsed.useCases.map((uc, idx) => (
                <div key={`usecase-${idx}`} className="text-sm text-slate-300 border-l-2 border-blue-500/30 pl-3">
                  <strong className="block text-blue-400 text-xs uppercase mb-1">Use Case {idx + 1}</strong>
                  <p className="mb-1">{uc.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* CARD 4b: Szeanarios */}
        <div className="bg-nexo-card rounded-2xl border border-nexo-border p-6 shadow-sm hover:border-slate-600 transition relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400"></div>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-white">Szenarien</h3>
          </div>
          {parsed.scenarios.length > 0 && (
            <div className="space-y-3">
              {parsed.scenarios.map((scenario, idx) => (
                <div key={`scenario-${idx}`} className="text-sm text-slate-300 border-l-2 border-green-500/30 pl-3">
                  <strong className="block text-green-400 text-xs uppercase mb-1">Szenario {idx + 1}</strong>
                  <p className="mb-1">{scenario.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* CARD 5: Risiken & Best Practices */}
        <div className="bg-nexo-card rounded-2xl border border-nexo-border p-6 shadow-sm hover:border-slate-600 transition relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-red-500 to-green-500"></div>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            <h3 className="font-semibold text-white">Kompromisse</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase text-red-400 font-bold mb-2 block tracking-wider">Risiken & Fallstricke</span>
              <ul className="text-xs text-nexo-muted space-y-2 list-disc list-inside marker:text-red-500">
                {Array.isArray((item as AnyRecord).risks) &&
                  (item as AnyRecord).risks.map((risks: string, idx: number) => <li key={`risk-${idx}`}>{risks}</li>)}
              </ul>
            </div>
            <div>
              <span className="text-[10px] uppercase text-green-400 font-bold mb-2 block tracking-wider">Bewährte Verfahren</span>
              <ul className="text-xs text-nexo-muted space-y-2 list-disc list-inside marker:text-green-500">
                {Array.isArray((item as AnyRecord).bestPractices) &&
                  (item as AnyRecord).bestPractices.map((bestPractice: string, idx: number) => <li key={`risk-${idx}`}>{bestPractice}</li>)}
              </ul>
            </div>
          </div>
        </div>
        {/* CARD 6: Metadaten & Ressourcen */}
        <div className="bg-nexo-card rounded-2xl border border-nexo-border p-6 shadow-sm hover:border-slate-600 transition relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-500"></div>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <h3 className="font-semibold text-white">I/O & Ressourcen</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Eingaben</span>
                <div className="text-xs text-slate-300">{Array.isArray(parsed.inputs) ? parsed.inputs.join(", ") : ""}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Ausgaben</span>
                <div className="text-xs text-slate-300">{Array.isArray(parsed.outputs) ? parsed.outputs.join(", ") : ""}</div>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Ressourcen</span>
              {parsed.resources.length > 0 && (
                <ul className="space-y-1">
                  {parsed.resources.map((resource, idx) => (
                    <li>
                      <a href={resource.url} target="_blank" className="text-xs text-nexo-aqua hover:underline flex items-center gap-1">
                        {resource.name}{" "}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* DETAIL CONTENT AREA */}
      <section className="space-y-10 pt-4">
        {/* Description  */}
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-nexo-aqua rounded-full"></span>
            Beschreibung
          </h2>
          <div className="prose prose-invert prose-slate max-w-none text-nexo-muted">
            <p className="leading-relaxed">{item.longDescription || ""}</p>
          </div>
        </div>
        {/* Benefits & Limitations (New Section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Vorteile</h3>
            <ul className="list-disc list-inside text-sm text-nexo-muted space-y-1">
              {Array.isArray((item as AnyRecord).benefits) &&
                (item as AnyRecord).benefits.map((benefit: string, idx: number) => <li key={`benefit-${idx}`}>{benefit}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Limitationen</h3>
            <ul className="list-disc list-inside text-sm text-nexo-muted space-y-1">
              {Array.isArray((item as AnyRecord).limitations) &&
                (item as AnyRecord).limitations.map((limitation: string, idx: number) => <li key={`limitation-${idx}`}>{limitation}</li>)}
            </ul>
          </div>
        </div>
        {/* Examples Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Beispiele & Implementierungen</h2>
          {parsed.examples.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsed.examples.map((example, idx) => (
                <div key={`example-${idx}`} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                  <h4 className="font-bold text-white mb-1">{example.name}</h4>
                  <p className="text-sm text-slate-400 mb-2">{example.description}</p>
                  <div className="flex gap-2">
                    {Array.isArray((example as AnyRecord).assets) &&
                      (example as AnyRecord).assets.map((asset: string, idx: number) => (
                        <span key={`assets-${idx}`} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                          {asset}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Implementation Steps */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Implementierungsschritte</h2>
          {Array.isArray((item as AnyRecord).limitations) &&
            (item as AnyRecord).implementationSteps.map((step: string, idx: number) => (
              <li key={`step-${idx}`} className="space-y-2 text-sm text-nexo-muted list-iside">
                {step}
              </li>
            ))}
        </div>
        {/* Tech Debts & Bottlenecks */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6">
          <h2 className="text-lg font-bold text-red-200 mb-3">Technische Schulden & Engpässe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-xs uppercase text-red-300 font-bold mb-2">Technische Schulden</h5>
              <ul className="space-y-1">
                {Array.isArray((item as AnyRecord).techDebts) &&
                  (item as AnyRecord).techDebts.map((techDebt: string, idx: number) => (
                    <li key={`techDebt-${idx}`} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> {techDebt}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs uppercase text-orange-300 font-bold mb-2">Engpässe</h5>
              <div className="flex flex-wrap gap-2">
                {Array.isArray((item as AnyRecord).bottleneckTags) &&
                  (item as AnyRecord).bottleneckTags.map((tag: string, idx: number) => (
                    <span key={`tag-${idx}`} className="px-2 py-1 bg-red-900/30 border border-red-800/50 rounded text-xs text-red-200">
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-red-500/10">
            <h5 className="text-xs uppercase text-red-300 font-bold mb-2">Beispiele für Missbrauch</h5>
            <ul className="text-sm text-slate-400 list-disc list-inside">
              {Array.isArray((item as AnyRecord).misuseExamples) &&
                (item as AnyRecord).misuseExamples.map((example: string, idx: number) => <li key={`example-${idx}`}>{example}</li>)}
            </ul>
          </div>
        </div>
        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 border-t border-slate-800">
          <div>
            <h5 className="text-xs uppercase text-slate-500 font-bold mb-2">Erforderliche Fähigkeiten</h5>
            <div className="flex flex-wrap gap-2">
              {Array.isArray((item as AnyRecord).requiredSkills) &&
                (item as AnyRecord).requiredSkills.map((skill: string, idx: number) => (
                  <span key={`skill-${idx}`} className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs uppercase text-slate-500 font-bold mb-2">Architektonische Treiber</h5>
            <div className="flex flex-wrap gap-2">
              {Array.isArray((item as AnyRecord).architecturalDrivers) &&
                (item as AnyRecord).architecturalDrivers.map((driver: string, idx: number) => (
                  <span key={`driver-${idx}`} className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">
                    {driver}
                  </span>
                ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs uppercase text-slate-500 font-bold mb-2">Einschränkungen</h5>
            <ul className="text-xs text-nexo-muted space-y-1">
              {Array.isArray((item as AnyRecord).constraints) &&
                (item as AnyRecord).constraints.map((constraint: string, idx: number) => <li key={`constraint-${idx}`}>{constraint}</li>)}
            </ul>
          </div>
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
