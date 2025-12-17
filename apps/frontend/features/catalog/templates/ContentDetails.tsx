import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { ContentDetail } from "@/types/catalog";
import { LocalizedTag } from "@/types/nexonoma";
import { ReferrerNav } from "../organisms/ReferrerNav";
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
  return (
    <div className="space-y-8 pb-20">
      {/* 0. Navigation */}
      <ReferrerNav segmentName={content.segmentName} clusterName={content.clusterName} macroClusterName={content.macroClusterName} />

      {/* 1. HERO SECTION */}
      <section className="relative bg-nexo-card rounded-2xl border border-nexo-border p-8 shadow-card overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-nexo-aqua/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <Badge
                variant={getBadgeVariant(contentType)}
                size="md"
                radius="md" // <-- Der Tech-Look
              >
                {contentType}
              </Badge>
              {content.tags?.slice(0, 8).map((tag: LocalizedTag, idx: number) => (
                <Badge
                  key={`${tag}-${idx}`}
                  variant="default"
                  size="md"
                  radius="md" // <-- Der Tech-Look
                >
                  #{tag.label}
                </Badge>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                {icon && (
                  <span className="text-3xl" aria-hidden>
                    {icon}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{content.name}</h1>
              </div>
              <p className="text-lg text-nexo-muted font-light leading-relaxed">{content.shortDescription}</p>
            </div>
            {heroQuote && <div className="pt-2 text-sm text-slate-400 max-w-2xl border-l-2 border-nexo-aqua/30 pl-4 italic">{heroQuote}</div>}
          </div>

          <div className="flex flex-row flex-wrap md:flex-col items-start md:items-end gap-3 min-w-[200px]">
            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-semibold">Reifegrad</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span>
                <span className="text-sm text-white font-medium">{content.maturityLevel}</span>
              </div>
            </div>
            {content.cognitiveLoad && (
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 uppercase font-semibold">Kognitive Belastung</span>
                <span className="text-sm text-red-400 font-medium">{content.cognitiveLoad}</span>
              </div>
            )}
            {content.status && (
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 uppercase font-semibold">Status</span>
                <span className="text-sm text-slate-300 font-medium">{content.status}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. BENTO GRID (Key Information) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1: Klassifikation */}
        <InfoCard title="Klassifikation" iconColor="text-purple-400" stripeColorClass="bg-linear-to-r from-purple-500 to-indigo-500">
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Komplexität</span>
              <span className="text-red-400">{content.complexityLevel}</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Auswirkungsbereich</span>
              <span className="text-slate-200">{content.impacts}</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Entscheidungstyp</span>
              <span className="text-slate-200">{content.decisionType}</span>
            </li>
            <li className="flex justify-between pt-1">
              <span className="text-slate-500">Organisationsreife</span>
              <span className="text-slate-200">{content.organizationalMaturity}</span>
            </li>
          </ul>
        </InfoCard>

        {/* CARD 2: Technisch */}
        <InfoCard title="Technischer Kontext" iconColor="text-nexo-aqua" stripeColorClass="bg-linear-to-r from-nexo-aqua to-nexo-ocean">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 block">Integrationen</span>
              <div className="flex flex-wrap gap-2">
                {content.integrations?.map((integ: string, idx: number) => (
                  <Badge key={`${integ}-${idx}`} variant="outline" size="md" radius="md" className="font-normal">
                    {integ}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 block">Alternativen</span>
              <ul className="text-sm text-slate-300 list-disc list-inside">
                {content.alternatives?.map((alt: string, idx: number) => (
                  <li key={idx} className="mb-1">
                    {alt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </InfoCard>

        {/* CARD 3: Prinzipien */}
        <InfoCard title="Prinzipien & Ziele" iconColor="text-slate-400" stripeColorClass="bg-slate-600">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {content.principles?.map((principle: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-slate-800/60 rounded text-xs border border-slate-700">
                  {principle}
                </span>
              ))}
            </div>
            <p className="text-sm text-nexo-muted leading-relaxed mt-2">
              <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Wertstrom</span>
              <span className="text-white">{content.valueStreamStage}</span>
            </p>
            <p className="text-sm text-nexo-muted leading-relaxed">
              <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Organisationsebene</span>
              <span className="text-white">{content.organizationalLevel?.join(", ")}</span>
            </p>
          </div>
        </InfoCard>

        {/* CARD 4: Use Cases & Scenarios */}
        <InfoCard title="Use Cases & Szenarien" iconColor="text-blue-400" stripeColorClass="bg-blue-500">
          <div className="space-y-4">
            {content.useCases?.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-blue-400 font-bold">Use Cases</span>
                {content.useCases.map((uc: any, idx: number) => (
                  <div key={idx} className="text-sm text-slate-300 border-l-2 border-blue-500/30 pl-3">
                    <p>{uc.description}</p>
                  </div>
                ))}
              </div>
            )}
            {content.scenarios?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase text-green-400 font-bold">Szenarien</span>
                {content.scenarios.map((sc: any, idx: number) => (
                  <div key={idx} className="text-sm text-slate-300 border-l-2 border-green-500/30 pl-3">
                    <p>{sc.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </InfoCard>

        {/* CARD 5: Kompromisse */}
        <InfoCard title="Kompromisse" iconColor="text-slate-400" stripeColorClass="bg-linear-to-r from-red-500 to-green-500">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase text-red-400 font-bold mb-2 block tracking-wider">Risiken</span>
              <ul className="text-xs text-nexo-muted space-y-2 list-disc list-inside marker:text-red-500">
                {content.risks?.map((risk: string, idx: number) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] uppercase text-green-400 font-bold mb-2 block tracking-wider">Best Practices</span>
              <ul className="text-xs text-nexo-muted space-y-2 list-disc list-inside marker:text-green-500">
                {content.bestPractices?.map((bp: string, idx: number) => (
                  <li key={idx}>{bp}</li>
                ))}
              </ul>
            </div>
          </div>
        </InfoCard>

        {/* CARD 6: I/O & Ressourcen */}
        <InfoCard title="I/O & Ressourcen" iconColor="text-indigo-400" stripeColorClass="bg-indigo-500">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Eingaben</span>
                <div className="text-xs text-slate-300">{content.inputs?.join(", ")}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Ausgaben</span>
                <div className="text-xs text-slate-300">{content.outputs?.join(", ")}</div>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Ressourcen</span>
              <ul className="space-y-1">
                {content.resources?.map((res: any, idx: number) => (
                  <li key={idx}>
                    <a href={res.url} target="_blank" className="text-xs text-nexo-aqua hover:underline flex items-center gap-1">
                      {res.name} ↗
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
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-nexo-aqua rounded-full"></span>
            Beschreibung
          </h2>
          <div className="prose prose-invert prose-slate max-w-none text-nexo-muted text-base leading-relaxed">
            <p>{content.longDescription}</p>
          </div>
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">✔</span> Vorteile
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
              <span className="text-red-400">✖</span> Limitationen
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
        </div>

        {/* Examples */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Beispiele & Implementierungen</h2>
          {content.examples?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.examples.map((example: any, idx: number) => (
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
        </div>

        {/* Implementation Steps */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Implementierungsschritte</h2>
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
        </div>

        {/* Tech Debt (Warning Section) */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6">
          <h2 className="text-lg font-bold text-red-200 mb-4 flex items-center gap-2">
            <span className="p-1 rounded bg-red-500/20">⚠️</span> Technische Schulden & Engpässe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h5 className="text-xs uppercase text-red-300 font-bold mb-2">Risiko-Faktoren</h5>
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
              <h5 className="text-xs uppercase text-orange-300 font-bold mb-2">Bekannte Engpässe</h5>
              <div className="flex flex-wrap gap-2">
                {content.bottleneckTags?.map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-red-900/30 border border-red-800/50 rounded text-xs text-red-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Missuse Examples */}
          {content.misuseExamples?.length > 0 && (
            <div className="mt-6 pt-4 border-t border-red-500/10">
              <h5 className="text-xs uppercase text-red-300 font-bold mb-2">Beispiele für Missbrauch</h5>
              <ul className="text-sm text-slate-400 list-disc list-inside">
                {content.misuseExamples.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Additional Info (Skills, Drivers, Constraints) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 border-t border-slate-800">
          <div>
            <h5 className="text-xs uppercase text-slate-500 font-bold mb-3">Erforderliche Fähigkeiten</h5>
            <div className="flex flex-wrap gap-2">
              {content.requiredSkills?.map((skill: string, idx: number) => (
                <Badge key={`${skill}-${idx}`} variant="default" size="md" radius="md" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs uppercase text-slate-500 font-bold mb-3">Architektonische Treiber</h5>
            <div className="flex flex-wrap gap-2">
              {content.architecturalDrivers?.map((driver: string, idx: number) => (
                <span key={idx} className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">
                  {driver}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs uppercase text-slate-500 font-bold mb-3">Einschränkungen</h5>
            <ul className="text-xs text-nexo-muted space-y-1">
              {content.constraints?.map((constraint: string, idx: number) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-slate-600">•</span> {constraint}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
