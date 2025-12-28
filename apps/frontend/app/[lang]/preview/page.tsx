"use client";

import { Badge } from "@/components/ui/atoms/Badge"; // Falls vorhanden, sonst HTML fallback
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import { ArrowRight, Construction, Info, LayoutGrid, Map } from "lucide-react";

export default function PreviewTemplate() {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* --- HEADER --- */}
      <header className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
          <Construction className="w-3 h-3" />
          <span>{t("preview.page.header.badge")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t("preview.page.header.title")}</h1>
        <p className="text-lg text-gray-400 leading-relaxed">{t("preview.page.header.lead")}</p>
      </header>

      {/* --- MAIN GRID --- */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 1. MATRIX CARD (Analytical) */}
        <Card className="group relative overflow-hidden border-teal-500/20 bg-linear-to-b from-[#101A2E] to-[#0B1220]">
          {/* Abstract Visual: The Matrix Grid */}
          <div className="relative h-48 w-full border-b border-white/5 bg-[#0F1623] overflow-hidden flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0"
              style={{ backgroundImage: "radial-gradient(circle, rgba(45,212,191,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
            ></div>

            {/* Abstract UI Elements */}
            <div className="relative z-10 grid grid-cols-3 gap-2 p-4 w-64 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <div className="h-8 rounded bg-teal-500/20 border border-teal-500/30 col-span-1"></div>
              <div className="h-8 rounded bg-teal-500/10 border border-teal-500/10 col-span-2"></div>
              <div className="h-8 rounded bg-teal-500/10 border border-teal-500/10 col-span-2"></div>
              <div className="h-8 rounded bg-teal-500/40 border border-teal-500/50 col-span-1 shadow-[0_0_10px_rgba(20,184,166,0.2)]"></div>
              <div className="h-8 rounded bg-teal-500/10 border border-teal-500/10 col-span-1"></div>
              <div className="h-8 rounded bg-teal-500/10 border border-teal-500/10 col-span-1"></div>
              <div className="h-8 rounded bg-teal-500/10 border border-teal-500/10 col-span-1"></div>
            </div>

            {/* Label */}
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-teal-400/60 uppercase tracking-widest">
              {t("preview.page.matrix.systemLabel")}
            </div>
          </div>

          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-teal-400">
                <LayoutGrid className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("preview.page.matrix.label")}</span>
              </div>
              <Badge variant="outline" className="border-teal-500/20 text-teal-300 text-[10px]">
                {t("preview.page.matrix.badge")}
              </Badge>
            </div>
            <CardTitle className="text-2xl text-white">{t("preview.page.matrix.title")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-sm">{t("preview.page.matrix.body")}</p>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{t("preview.page.matrix.idealFor.label")}</p>
              <ul className="space-y-2">
                <ListItem icon="check" color="text-teal-400">
                  {t("preview.page.matrix.idealFor.item1")}
                </ListItem>
                <ListItem icon="check" color="text-teal-400">
                  {t("preview.page.matrix.idealFor.item2")}
                </ListItem>
                <ListItem icon="check" color="text-teal-400">
                  {t("preview.page.matrix.idealFor.item3")}
                </ListItem>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                <span>{t("preview.page.matrix.status")}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. CITY CARD (Explorative) */}
        <Card className="group relative overflow-hidden border-indigo-500/20 bg-linear-to-b from-[#101A2E] to-[#0B1220]">
          {/* Abstract Visual: The City Map */}
          <div className="relative h-48 w-full border-b border-white/5 bg-[#0F1623] overflow-hidden flex items-center justify-center">
            {/* Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>

            {/* Abstract Iso Buildings (SVG) */}
            <svg
              width="200"
              height="120"
              viewBox="0 0 200 120"
              fill="none"
              className="relative z-10 opacity-80 group-hover:scale-105 transition-transform duration-700"
            >
              {/* Block 1 */}
              <path d="M40 60 L80 80 L120 60 L80 40 Z" fill="#1e293b" stroke="#6366f1" strokeWidth="0.5" fillOpacity="0.5" />
              <path d="M40 60 L80 80 V110 L40 90 Z" fill="#0f172a" stroke="#6366f1" strokeWidth="0.5" fillOpacity="0.8" />
              <path d="M80 80 L120 60 V90 L80 110 Z" fill="#1e293b" stroke="#6366f1" strokeWidth="0.5" fillOpacity="0.8" />

              {/* Block 2 (Higher) */}
              <path d="M100 40 L140 60 L180 40 L140 20 Z" fill="#312e81" stroke="#818cf8" strokeWidth="1" fillOpacity="0.6" />
              <path d="M100 40 L140 60 V100 L100 80 Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" fillOpacity="0.9" />
              <path d="M140 60 L180 40 V80 L140 100 Z" fill="#312e81" stroke="#818cf8" strokeWidth="1" fillOpacity="0.9" />

              {/* Connection Line */}
              <path d="M80 80 L140 100" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            </svg>

            {/* Label */}
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

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                <span>{t("preview.page.city.status")}</span>
              </p>
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
