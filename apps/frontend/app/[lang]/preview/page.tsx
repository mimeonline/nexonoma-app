"use client";

import { Badge } from "@/components/ui/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import { ArrowRight, BookOpen, Construction, Info, Map, Radar, RefreshCw } from "lucide-react";

export default function PreviewTemplate() {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* --- HEADER --- */}
      <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            <Construction className="w-3 h-3" />
            <span>{t("preview.page.header.badge")}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t("preview.page.header.title")}</h1>
          <p className="text-lg text-gray-400 leading-relaxed">{t("preview.page.header.lead")}</p>
        </div>

        {/* --- CALLOUT --- */}
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-white">{t("preview.page.callout.title")}</h3>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">{t("preview.page.callout.body")}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300/90" />
              {t("preview.page.callout.pill1")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300/90" />
              {t("preview.page.callout.pill2")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300/90" />
              {t("preview.page.callout.pill3")}
            </span>
          </div>
        </aside>
      </header>

      {/* --- MAIN GRID --- */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 1) CITY (Preview) */}
        <Card className="group relative overflow-hidden border-indigo-500/20 bg-linear-to-b from-[#101A2E] to-[#0B1220]">
          {/* Abstract Visual: City */}
          <div className="relative h-48 w-full border-b border-white/5 bg-[#0F1623] overflow-hidden flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />

            <svg
              width="200"
              height="120"
              viewBox="0 0 200 120"
              fill="none"
              className="relative z-10 opacity-80 group-hover:scale-105 transition-transform duration-700"
            >
              <path d="M40 60 L80 80 L120 60 L80 40 Z" fill="#1e293b" stroke="#6366f1" strokeWidth="0.5" fillOpacity="0.5" />
              <path d="M40 60 L80 80 V110 L40 90 Z" fill="#0f172a" stroke="#6366f1" strokeWidth="0.5" fillOpacity="0.8" />
              <path d="M80 80 L120 60 V90 L80 110 Z" fill="#1e293b" stroke="#6366f1" strokeWidth="0.5" fillOpacity="0.8" />

              <path d="M100 40 L140 60 L180 40 L140 20 Z" fill="#312e81" stroke="#818cf8" strokeWidth="1" fillOpacity="0.6" />
              <path d="M100 40 L140 60 V100 L100 80 Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" fillOpacity="0.9" />
              <path d="M140 60 L180 40 V80 L140 100 Z" fill="#312e81" stroke="#818cf8" strokeWidth="1" fillOpacity="0.9" />

              <path d="M80 80 L140 100" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            </svg>

            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-indigo-400/60 uppercase tracking-widest">
              {t("preview.page.city.spatialLabel")}
            </div>
          </div>

          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Map className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("preview.page.city.label")}</span>
              </div>
              <Badge variant="outline" className="border-indigo-500/20 text-indigo-300 text-[10px]">
                {t("preview.page.city.badge")}
              </Badge>
            </div>

            <CardTitle className="text-2xl text-white">{t("preview.page.city.title")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-sm">{t("preview.page.city.body")}</p>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{t("preview.page.city.idealFor.label")}</p>
              <ul className="space-y-2">
                <ListItem icon="arrow" color="text-indigo-400">
                  {t("preview.page.city.idealFor.item1")}
                </ListItem>
                <ListItem icon="arrow" color="text-indigo-400">
                  {t("preview.page.city.idealFor.item2")}
                </ListItem>
                <ListItem icon="arrow" color="text-indigo-400">
                  {t("preview.page.city.idealFor.item3")}
                </ListItem>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                <span>{t("preview.page.city.status")}</span>
              </p>

              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-indigo-400/80" />
                {t("preview.page.status.preview")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2) LERNPFADE (Planned) */}
        <Card className="group relative overflow-hidden border-blue-500/20 bg-linear-to-b from-[#101A2E] to-[#0B1220]">
          {/* Abstract Visual: Learning Paths */}
          <div className="relative h-48 w-full border-b border-white/5 bg-[#0F1623] overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-70"
              style={{ backgroundImage: "radial-gradient(circle, rgba(90,167,255,0.10) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
            />
            <div className="relative z-10 w-[280px] space-y-2 opacity-85 group-hover:opacity-100 transition-opacity duration-500">
              <div className="h-9 rounded-lg bg-blue-500/20 border border-blue-500/30" />
              <div className="h-9 rounded-lg bg-blue-500/10 border border-blue-500/10 w-5/6" />
              <div className="h-9 rounded-lg bg-blue-500/10 border border-blue-500/10 w-4/6" />
              <div className="h-9 rounded-lg bg-blue-500/10 border border-blue-500/10 w-3/6" />
            </div>
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">
              {t("preview.page.learning.systemLabel")}
            </div>
          </div>

          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-400">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("preview.page.learning.label")}</span>
              </div>
              <Badge variant="outline" className="border-blue-500/20 text-blue-300 text-[10px]">
                {t("preview.page.learning.badge")}
              </Badge>
            </div>

            <CardTitle className="text-2xl text-white">{t("preview.page.learning.title")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-sm">{t("preview.page.learning.body")}</p>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{t("preview.page.learning.idealFor.label")}</p>
              <ul className="space-y-2">
                <ListItem icon="check" color="text-blue-400">
                  {t("preview.page.learning.idealFor.item1")}
                </ListItem>
                <ListItem icon="check" color="text-blue-400">
                  {t("preview.page.learning.idealFor.item2")}
                </ListItem>
                <ListItem icon="check" color="text-blue-400">
                  {t("preview.page.learning.idealFor.item3")}
                </ListItem>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                <span>{t("preview.page.learning.status")}</span>
              </p>

              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-white/35" />
                {t("preview.page.status.planned")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 3) RADAR (Planned) */}
        <Card className="group relative overflow-hidden border-teal-500/20 bg-linear-to-b from-[#101A2E] to-[#0B1220]">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-teal-400">
                <Radar className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("preview.page.radar.label")}</span>
              </div>
              <Badge variant="outline" className="border-white/15 text-white/80 text-[10px]">
                {t("preview.page.radar.badge")}
              </Badge>
            </div>

            <CardTitle className="text-2xl text-white">{t("preview.page.radar.title")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-sm">{t("preview.page.radar.body")}</p>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{t("preview.page.radar.idealFor.label")}</p>
              <ul className="space-y-2">
                <ListItem icon="check" color="text-teal-400">
                  {t("preview.page.radar.idealFor.item1")}
                </ListItem>
                <ListItem icon="check" color="text-teal-400">
                  {t("preview.page.radar.idealFor.item2")}
                </ListItem>
                <ListItem icon="check" color="text-teal-400">
                  {t("preview.page.radar.idealFor.item3")}
                </ListItem>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                <span>{t("preview.page.radar.status")}</span>
              </p>

              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-white/35" />
                {t("preview.page.status.planned")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 4) TRANSITION (Optional) */}
        <Card className="group relative overflow-hidden border-white/10 bg-linear-to-b from-[#101A2E] to-[#0B1220]">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white/70">
                <RefreshCw className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("preview.page.transition.label")}</span>
              </div>
              <Badge variant="outline" className="border-white/15 text-white/80 text-[10px]">
                {t("preview.page.transition.badge")}
              </Badge>
            </div>

            <CardTitle className="text-2xl text-white">{t("preview.page.transition.title")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-sm">{t("preview.page.transition.body")}</p>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{t("preview.page.transition.idealFor.label")}</p>
              <ul className="space-y-2">
                <ListItem icon="check" color="text-white/70">
                  {t("preview.page.transition.idealFor.item1")}
                </ListItem>
                <ListItem icon="check" color="text-white/70">
                  {t("preview.page.transition.idealFor.item2")}
                </ListItem>
                <ListItem icon="check" color="text-white/70">
                  {t("preview.page.transition.idealFor.item3")}
                </ListItem>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                <span>{t("preview.page.transition.status")}</span>
              </p>

              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-white/30" />
                {t("preview.page.status.optional")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- DISCLAIMER / CONTEXT --- */}
      <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="shrink-0 rounded-lg bg-blue-500/10 p-3 text-blue-400">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{t("preview.page.note.title")}</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">{t("preview.page.note.body")}</p>
        </div>
      </div>
    </div>
  );
}

// --- Helper Component for List Items ---
function ListItem({ children, icon, color }: { children: React.ReactNode; icon: "check" | "arrow"; color: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-300">
      <span className={`mt-0.5 shrink-0 ${color}`}>
        {icon === "check" ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </span>
      <span>{children}</span>
    </li>
  );
}
