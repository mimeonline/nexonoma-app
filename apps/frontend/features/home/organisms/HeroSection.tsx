"use client";
import { Button } from "@/components/ui/atoms/Button";
import { useI18n } from "@/features/i18n/I18nProvider";
import { Building2, Table2 } from "lucide-react";

export default function HeroSection() {
  const { dict } = useI18n();
  console.log("[DEBUG] dict keys:", Object.keys(dict));
  return (
    <section className="relative pt-10 sm:pt-16">
      {/* Abstract Background Glow */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-nexo-ocean/10 blur-[120px]" />

      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-nexo-ocean backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nexo-ocean opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-nexo-ocean"></span>
              </span>
              Nexonoma MVP Live
            </div>
            <h1 className="font-[--font-space-grotesk] text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Komplexität beherrschen <br />
              {/* Changes:
                   1. Keine Punkte am Ende der Zeilen für besseren Flow.
                   2. Gradient fokusiert auf 'nexo-ocean' (seriöser).
                   3. 'from-30%' sorgt dafür, dass der Text erst weiß bleibt und dann sanft ins Blaue übergeht.
                */}
              <span className="inline-block bg-linear-to-r from-white from-30% to-nexo-ocean bg-clip-text text-transparent pb-2">
                Zusammenhänge verstehen
              </span>
            </h1>

            <p className="max-w-xl text-lg text-nexo-muted leading-relaxed mt-6">
              Dein visueller Guide durch den Dschungel aus Methoden, Tools und Patterns. Nexonoma liefert dir Struktur und Orientierung, genau dort,
              wo du im Prozess stehst.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="h-12 bg-nexo-ocean text-nexo-bg hover:bg-nexo-ocean/90 hover:shadow-[0_0_20px_-5px_#4FF4E0]">
              Wissensnetz starten
            </Button>
            <Button className="h-12 border border-white/10 bg-transparent text-white hover:bg-white/5">Wie es funktioniert</Button>
          </div>
        </div>

        {/* Visual: The SDLC Context Graph (Ocean Theme) */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-full">
          <div className="relative min-h-[480px] rounded-3xl border border-white/10 bg-nexo-surface shadow-2xl shadow-black/60 overflow-hidden flex flex-col select-none">
            {/* --- 0. BACKGROUND LAYERS --- */}
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf81a_1px,transparent_1px),linear-gradient(to_bottom,#38bdf81a_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

            {/* Ambient Glows (Ocean Blue) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-64 bg-nexo-ocean/10 blur-[80px] rounded-full"></div>

            {/* --- NEW HEADER: Context Definition --- */}
            <div className="relative z-20 flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-nexo-ocean/20 text-nexo-ocean shadow-inner shadow-nexo-ocean/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">Software Development Lifecycle</span>
                </div>
              </div>
              {/* Status Badge */}
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/5 bg-black/20 px-3 py-1">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">LIVE MAPPING</span>
              </div>
            </div>

            {/* --- 1. TOP LAYER: The Pipeline (SDLC Phases) --- */}
            <div className="relative z-10 flex justify-between px-8 sm:px-12 pt-10 pb-6">
              {/* Connecting Line behind phases */}
              <div className="absolute top-14 left-16 right-16 h-0.5 bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

              {/* Phase 1: Analyse (Inactive) */}
              <div className="relative flex flex-col items-center gap-3 opacity-40 grayscale transition-all duration-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#131C2E] border border-white/10 z-10">
                  <div className="h-2 w-2 rounded-full bg-slate-500"></div>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-widest">Analyse</span>
              </div>

              {/* Phase 2: Design/Build (ACTIVE - OCEAN) */}
              <div className="relative flex flex-col items-center gap-3 z-20">
                {/* Glow Effect */}
                <div className="absolute -top-6 -left-6 h-20 w-20 bg-nexo-ocean/20 blur-2xl rounded-full"></div>

                {/* The Node */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#131C2E] border-2 border-nexo-ocean shadow-[0_0_30px_-5px_rgba(56,189,248,0.5)] z-10">
                  <div className="h-3 w-3 rounded-full bg-nexo-ocean animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
                </div>
                <span className="text-[11px] font-mono font-bold text-nexo-ocean uppercase tracking-widest drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                  Entwurf
                </span>

                {/* Vertical Data Stream (The Beam) */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-linear-to-b from-nexo-ocean via-nexo-ocean/40 to-transparent"></div>
                {/* Moving Particle on the Beam - Uses class from globals.css */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1 h-2.5 bg-white blur-[2px] rounded-full animate-beam-drop"></div>
              </div>

              {/* Phase 3: Operate (Inactive) */}
              <div className="relative flex flex-col items-center gap-3 opacity-40 grayscale">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#131C2E] border border-white/10 z-10">
                  <div className="h-2 w-2 rounded-full bg-slate-500"></div>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-widest">Betrieb</span>
              </div>
            </div>

            {/* --- 2. MIDDLE LAYER: The "Processing Hub" --- */}
            <div className="relative z-10 flex justify-center py-2 mb-2">
              <div className="relative flex items-center justify-center gap-3 rounded-xl border border-nexo-ocean/30 bg-[#0F172A]/90 px-6 py-3 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexo-ocean opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-nexo-ocean"></span>
                  </div>
                  <span className="text-xs font-medium text-slate-200">Context Matching...</span>
                </div>
                {/* Badge */}
                <div className="flex items-center rounded bg-nexo-ocean/10 px-2 py-1 text-[10px] font-bold text-nexo-ocean border border-nexo-ocean/20">
                  2 Matches
                </div>
              </div>
            </div>

            {/* --- 3. CONNECTOR SVG (Visible Connections) --- */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
              <defs>
                <linearGradient id="grad-ocean-left" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="grad-ocean-right" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Curve to Left Card */}
              <path d="M50% 52% C 50% 65%, 25% 65%, 25% 75%" fill="none" stroke="url(#grad-ocean-left)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Curve to Right Card */}
              <path d="M50% 52% C 50% 65%, 75% 65%, 75% 75%" fill="none" stroke="url(#grad-ocean-right)" strokeWidth="1.5" />
            </svg>

            {/* --- 4. BOTTOM LAYER: Content Cards --- */}
            <div className="relative z-10 mt-auto grid grid-cols-2 gap-4 px-6 pb-6">
              {/* Card 1: Clean Arch */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-[#131C2E] p-4 transition-all duration-300 hover:border-nexo-ocean/30 hover:bg-[#1A2438] hover:-translate-y-1">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase text-slate-500">Concept</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white">Clean Arch.</h4>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">Trennung von Verantwortlichkeiten.</p>
                </div>
              </div>

              {/* Card 2: C4 Model (Highlighted Ocean) */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-nexo-ocean/40 bg-[#131C2E] p-4 shadow-[0_10px_40px_-10px_rgba(56,189,248,0.15)] transition-all duration-300 hover:-translate-y-1">
                {/* Best Fit Badge */}
                <div className="absolute -top-3 right-4 rounded-full bg-nexo-ocean px-2.5 py-0.5 text-[9px] font-bold text-nexo-surface shadow-lg shadow-nexo-ocean/40 tracking-wide">
                  BEST FIT
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nexo-ocean/10 text-nexo-ocean">
                      <Table2 className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase text-nexo-ocean">Method</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">C4 Model</h4>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">Visualisierung von Architektur auf 4 Ebenen.</p>
                </div>

                {/* Subtle Glow at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-nexo-ocean/50 to-transparent opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
