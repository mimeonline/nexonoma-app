export function CityDistrict({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative p-8 border border-white/5 rounded-3xl bg-[#0F1623]/80 backdrop-blur-sm transition-colors hover:border-white/10 hover:bg-[#131b2b]">
      {/* Label on the Floor */}
      <div className="absolute top-4 left-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 rotate-0">{title}</div>

      {/* Grid on the floor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none rounded-3xl"></div>

      {/* Buildings Container */}
      <div className="mt-8 flex flex-wrap gap-8 items-end justify-center min-h-[150px]">{children}</div>
    </div>
  );
}
