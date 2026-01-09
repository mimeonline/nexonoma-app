import { LayoutGrid, LayoutPanelTop } from "lucide-react";

type ViewMode = "grid" | "board";
type FilterType = "all" | string;

type SegmentControlBarProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  viewLabel?: string;
  activeType: FilterType;
  onTypeChange: (type: FilterType) => void;
  typeOptions: { value: FilterType; label: string }[];
  showSegmentFilter?: boolean;
  segmentLabel?: string;
  activeSegment?: FilterType;
  onSegmentChange?: (segment: FilterType) => void;
  segmentOptions?: { value: FilterType; label: string }[];
  typeLabel?: string;
  labels: {
    tiles: string;
    board: string;
  };
};

export function SegmentControlBar({
  viewMode,
  onViewModeChange,
  viewLabel,
  activeType,
  onTypeChange,
  typeOptions,
  showSegmentFilter = false,
  segmentLabel,
  activeSegment,
  onSegmentChange,
  segmentOptions = [],
  typeLabel,
  labels,
}: SegmentControlBarProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="min-h-[16px] text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {viewLabel}
            </div>
            <div className="flex h-10 w-full items-center rounded-xl border border-white/10 bg-white/5 p-1 md:w-56">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`flex-1 flex h-full items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "grid" ? "bg-nexo-ocean/10 text-nexo-ocean shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> {labels.tiles}
              </button>

              <button
                onClick={() => onViewModeChange("board")}
                className={`flex-1 flex h-full items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "board" ? "bg-nexo-ocean/10 text-nexo-ocean shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutPanelTop className="h-3.5 w-3.5" /> {labels.board}
              </button>
            </div>
          </div>

          {showSegmentFilter && (
            <div className="space-y-1">
              {segmentLabel && (
                <div className="min-h-[16px] text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{segmentLabel}</div>
              )}
              <div className="relative w-full md:w-56">
                <select
                  value={activeSegment}
                  onChange={(e) => onSegmentChange?.(e.target.value as FilterType)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {segmentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {typeLabel && (
              <div className="min-h-[16px] text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{typeLabel}</div>
            )}
            <div className="relative w-full md:w-56">
              <select
                value={activeType}
                onChange={(e) => onTypeChange(e.target.value as FilterType)}
                className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-56" />
      </div>
    </div>
  );
}
