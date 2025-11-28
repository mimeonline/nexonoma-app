import { LandingCard } from "@/components/ui/landing-card";
import { Building2, LayoutGrid, Table2 } from "lucide-react";
import { Inter, Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function Home() {
  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} min-h-screen bg-[#0B1220] text-white`}
    >
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12 font-[var(--font-inter)] sm:py-16">
        <header className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300/70">
            MVP Landing
          </span>
          <h1 className="font-[var(--font-space-grotesk)] text-4xl font-semibold leading-tight sm:text-5xl">
            Nexonoma
          </h1>
          <p className="max-w-3xl text-lg font-medium text-slate-200/85">
            Visuelle Wissensnavigation für Entwickler und Architekten
          </p>
        </header>

        <section className="max-w-3xl space-y-3 text-base leading-relaxed text-slate-200/85 sm:text-lg">
          <p>
            Nexonoma verbindet Wissensbereiche und
            Wissensbausteine zu einer interaktiven, mehrdimensionalen
            Navigationsoberfläche.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <LandingCard
            title="Grid-Ansicht"
            description="Klassische Kartenansicht – alle Bausteine nach Bereichen sortiert."
            href="/grid"
            icon={<LayoutGrid className="h-5 w-5" />}
          />
          <LandingCard
            title="Matrix-Ansicht"
            description="Systemische Perspektive – Filter & Beziehungen im Kontext."
            href="/matrix"
            icon={<Table2 className="h-5 w-5" />}
          />
          <LandingCard
            title="City-Ansicht"
            description="Visuelles Stadt-Layout – erkunde das Wissensmodell räumlich."
            href="/city"
            icon={<Building2 className="h-5 w-5" />}
          />
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-r from-[#131C2E] via-[#0F182A] to-[#1F2A40] p-6 sm:p-8">
          <div className="absolute inset-0 blur-3xl" aria-hidden="true">
            <div className="absolute left-10 top-4 h-24 w-24 rounded-full bg-[#4C6BFF33]" />
            <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-[#1AD4FF33]" />
          </div>
          <div className="relative flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200/75">
              Intro
            </p>
            <p className="text-base text-slate-200/85 sm:text-lg">
              Placeholder für ein zukünftiges Visual: eine marinefarbene Fläche
              mit sanftem Glow, die das Navigationskonzept andeutet.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
