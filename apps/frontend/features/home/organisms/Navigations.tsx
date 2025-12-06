import { Card, CardContent, CardFooter, CardHeader, CardIcon, CardTitle } from "@/components/ui/atoms/Card";
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { ArrowRight, Building2, LayoutGrid, Table2 } from "lucide-react";
import Link from "next/link";

export function Navigations() {
  return (
    <section>
      <SectionTitle
        badge="Explorer"
        title="Wähle deine Perspektive"
        description="Drei Ansichten für unterschiedliche Fragestellungen. Tauche tief in dein Wissensnetz ein."
        className="mb-12"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* --- 1. GRID VIEW (Ocean Blue) --- */}
        <Link href="/grid" passHref>
          <Card variant="interactive" className="h-[280px] flex flex-col relative overflow-hidden">
            {/* Background Visual */}
            <div className="absolute -right-5 -top-5 opacity-20 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-30 pointer-events-none">
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-12 w-12 rounded-lg bg-nexo-ocean/40 backdrop-blur-sm"></div>
                ))}
              </div>
            </div>

            <CardHeader>
              <CardIcon className="bg-nexo-ocean/10 text-nexo-ocean border-nexo-ocean/20">
                <LayoutGrid className="h-6 w-6" />
              </CardIcon>
              <CardTitle className="group-hover:text-nexo-ocean">Grid-Ansicht</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-slate-400 leading-relaxed max-w-[90%]">
                Der strukturierte Katalog. Alle Bausteine hierarchisch sortiert für den schnellen Zugriff.
              </p>
            </CardContent>

            <CardFooter>
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors">
                Zum Grid
                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </CardFooter>
          </Card>
        </Link>

        {/* --- 2. MATRIX VIEW (Aqua) --- */}
        <Link href="/matrix" passHref>
          <Card
            variant="interactive"
            // Override hover border color to match Aqua theme
            className="h-[280px] flex flex-col relative overflow-hidden hover:border-nexo-aqua/40"
          >
            {/* Background Visual */}
            <div className="absolute right-[-30px] top-10 opacity-10 transition-transform duration-500 group-hover:-translate-x-2.5 group-hover:opacity-25 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" stroke="currentColor" className="text-nexo-aqua">
                <line x1="0" y1="40" x2="200" y2="40" strokeWidth="1" />
                <line x1="0" y1="80" x2="200" y2="80" strokeWidth="1" />
                <line x1="0" y1="120" x2="200" y2="120" strokeWidth="1" />
                <line x1="40" y1="0" x2="40" y2="200" strokeWidth="1" />
                <line x1="80" y1="0" x2="80" y2="200" strokeWidth="1" />
                <rect x="80" y="40" width="40" height="40" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </div>

            <CardHeader>
              <CardIcon className="bg-nexo-aqua/10 text-nexo-aqua border-nexo-aqua/20">
                <Table2 className="h-6 w-6" />
              </CardIcon>
              <CardTitle className="group-hover:text-nexo-aqua">Matrix-Ansicht</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-slate-400 leading-relaxed max-w-[90%]">
                Die systemische Analyse. Filter & Beziehungen im Kontext von Cluster × Segmenten.
              </p>
            </CardContent>

            <CardFooter>
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors">
                Zur Matrix
                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </CardFooter>
          </Card>
        </Link>

        {/* --- 3. CITY VIEW (Purple) --- */}
        <Link href="/city" passHref>
          <Card
            variant="interactive"
            // Override hover border color to match Purple theme
            className="h-[280px] flex flex-col relative overflow-hidden hover:border-purple-500/40"
          >
            <div className="absolute -right-2.5 -bottom-5 opacity-15 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:opacity-25 pointer-events-none">
              <div className="flex items-end gap-1">
                <div className="h-16 w-8 rounded-t bg-purple-400"></div>
                <div className="h-24 w-10 rounded-t bg-purple-400 opacity-80"></div>
                <div className="h-12 w-6 rounded-t bg-purple-400 opacity-60"></div>
                <div className="h-32 w-12 rounded-t bg-purple-400 opacity-40"></div>
              </div>
            </div>

            <CardHeader>
              <CardIcon className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                <Building2 className="h-6 w-6" />
              </CardIcon>
              <CardTitle className="group-hover:text-purple-400">City-Ansicht</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-slate-400 leading-relaxed max-w-[90%]">
                Die visuelle Entdeckungsreise. Erfasse Zusammenhänge räumlich und intuitiv.
              </p>
            </CardContent>

            <CardFooter>
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors">
                Zur City
                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </section>
  );
}
