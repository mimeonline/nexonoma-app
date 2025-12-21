"use client";

import { useI18n } from "@/features/i18n/I18nProvider";

export default function MatrixPage() {
  const { t } = useI18n();

  return (
    <div className="p-4">
      <h1 className="font-display mb-4 text-3xl font-bold">{t("matrix.title")}</h1>
      <p className="font-sans pb-8">{t("matrix.description")}</p>
      <div className="flex flex-col h-screen bg-[#0f172a] text-[#f8fafc] font-sans overflow-hidden">
        {/* Header Section */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#0f172a] border-b border-[#334155] z-20 shrink-0">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#f8fafc]">Decision Matrix</h1>
            <p className="text-sm text-[#94a3b8]">Perspective: Organizational Maturity vs. Value Stream</p>
          </div>

          <div className="flex gap-4 text-xs text-[#94a3b8]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#60a5fa]"></div> Concept
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#34d399]"></div> Method
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#fb923c]"></div> Tool
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#a78bfa]"></div> Technology
            </div>
          </div>
        </header>

        {/* Matrix Viewport */}
        <div className="flex-1 overflow-auto relative p-4 scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-[#0f172a]">
          <div
            className="grid gap-[1px] bg-[#334155] border border-[#334155]"
            style={{
              gridTemplateColumns: "140px repeat(4, minmax(280px, 1fr))",
              gridTemplateRows: "50px repeat(3, minmax(200px, 1fr))",
            }}
          >
            {/* CORNER (0,0) */}
            <div className="sticky top-0 left-0 z-10 flex items-center justify-center bg-[#0f172a] text-[0.7rem] font-bold text-[#94a3b8] border-b border-r border-[#334155]">
              AXIS MAP
            </div>

            {/* X-AXIS LABELS (Value Stream) */}
            {["Discovery", "Build", "Run", "Iterate"].map((label) => (
              <div
                key={label}
                className="sticky top-0 z-[5] flex items-center justify-center bg-[#0f172a] text-xs font-semibold uppercase tracking-wider text-[#94a3b8] border-b border-[#334155]"
              >
                {label}
              </div>
            ))}

            {/* --- ROW 1: Advanced --- */}
            {/* Y-AXIS LABEL */}
            <div className="sticky left-0 z-[5] flex flex-col items-end justify-center pr-4 bg-[#0f172a] text-right border-r border-[#334155]">
              <span className="text-sm font-semibold text-[#94a3b8]">Advanced</span>
              <span className="text-[0.7rem] font-normal opacity-60 text-[#94a3b8] mt-1">Highly Adaptive</span>
            </div>

            {/* CELLS ROW 1 */}
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="concept" title="Domain Storytelling" icon="🧠" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="method" title="Event Storming" icon="⚡️" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="technology" title="Service Mesh" icon="🕸️" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="method" title="Chaos Engineering" icon="🔄" />
            </div>

            {/* --- ROW 2: Intermediate --- */}
            {/* Y-AXIS LABEL */}
            <div className="sticky left-0 z-[5] flex flex-col items-end justify-center pr-4 bg-[#0f172a] text-right border-r border-[#334155]">
              <span className="text-sm font-semibold text-[#94a3b8]">Intermediate</span>
              <span className="text-[0.7rem] font-normal opacity-60 text-[#94a3b8] mt-1">Defined Process</span>
            </div>

            {/* CELLS ROW 2 */}
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="method" title="Design Thinking" icon="🎨" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="tool" title="Docker" icon="🐳" />
              <AssetCard type="method" title="TDD" icon="🧪" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="tool" title="Prometheus" icon="📊" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <div className="text-xs text-[#334155] text-center mt-8 italic pointer-events-none">No specific recommendations</div>
            </div>

            {/* --- ROW 3: Foundation --- */}
            {/* Y-AXIS LABEL */}
            <div className="sticky left-0 z-[5] flex flex-col items-end justify-center pr-4 bg-[#0f172a] text-right border-r border-[#334155]">
              <span className="text-sm font-semibold text-[#94a3b8]">Foundation</span>
              <span className="text-[0.7rem] font-normal opacity-60 text-[#94a3b8] mt-1">Ad-hoc / Basic</span>
            </div>

            {/* CELLS ROW 3 */}
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="method" title="User Stories" icon="📋" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="tool" title="Git Basics" icon="🐙" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="concept" title="Logging" icon="📄" />
            </div>
            <div className="bg-[#131c31] p-4 flex flex-col gap-3 hover:bg-[#1a243a] transition-colors">
              <AssetCard type="method" title="Retrospectives" icon="🔁" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type AssetType = "concept" | "method" | "tool" | "technology";

interface AssetCardProps {
  type: AssetType;
  title: string;
  icon: string;
}

// --- Helper Component for Asset Cards ---
const AssetCard = ({ type, title, icon }: AssetCardProps) => {
  // Mapping types to their specific color stripe
  const typeColors: Record<AssetType, string> = {
    concept: "bg-[#60a5fa]",
    method: "bg-[#34d399]",
    tool: "bg-[#fb923c]",
    technology: "bg-[#a78bfa]",
  };

  const stripeColor = typeColors[type] || "bg-gray-500";

  return (
    <div className="group relative flex items-center gap-3 p-3 bg-[#1e293b] border border-[#334155] rounded-md cursor-pointer overflow-hidden transition-all hover:-translate-y-0.5 hover:border-[#94a3b8] hover:shadow-lg">
      {/* Color Stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${stripeColor}`} />

      {/* Icon Placeholder */}
      <div className="flex items-center justify-center w-6 h-6 bg-white/5 rounded text-xs text-[#94a3b8]">{icon}</div>

      {/* Content */}
      <div className="flex-1">
        <div className="text-sm font-medium text-[#f8fafc] mb-[2px]">{title}</div>
        <div className="text-[0.65rem] uppercase tracking-wider text-[#94a3b8]">{type}</div>
      </div>
    </div>
  );
};
