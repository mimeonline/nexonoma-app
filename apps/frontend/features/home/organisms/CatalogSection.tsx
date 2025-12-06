import { Button } from "@/components/ui/atoms/Button";
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { ArrowRight } from "lucide-react";
import { CatalogVisual } from "./CatalogVisual";

export function CatalogSection() {
  return (
    <section className="grid gap-12 lg:grid-cols-2 lg:items-start">
      {/* LEFT COLUMN: Text Content */}
      <div className="space-y-8 pt-2">
        <SectionTitle
          title="Der Wissens-Katalog"
          description="Schluss mit veralteten Wikis und Linksammlungen. Nexonoma ist deine Single Source of Truth."
          className="mb-0"
        />

        <div className="space-y-6">
          {/* Benefit 1 */}
          <div className="flex gap-4 group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-nexo-surface border border-white/5 shadow-inner group-hover:border-nexo-ocean/30 transition-colors">
              <div className="h-2 w-2 rounded-full bg-nexo-ocean shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Zentralisiertes Inventar</h4>
              <p className="text-sm text-nexo-muted leading-relaxed mt-1">
                Über 150+ kuratierte Bausteine. Konzepte, Methoden und Tools an einem Ort – immer aktuell und durchsuchbar.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex gap-4 group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-nexo-surface border border-white/5 shadow-inner group-hover:border-nexo-aqua/30 transition-colors">
              <div className="h-2 w-2 rounded-full bg-nexo-aqua shadow-[0_0_10px_rgba(79,244,224,0.5)]"></div>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Semantisch Vernetzt</h4>
              <p className="text-sm text-nexo-muted leading-relaxed mt-1">
                Verstehe Beziehungen: Welches Tool passt zu welcher Methode? Welches Tech braucht welches Konzept?
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button className="h-12 border border-white/10 bg-white/5 px-6 text-white hover:bg-white/10 group">
            <span className="mr-2">Zum Katalog</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* RIGHT COLUMN: The Visual Component */}
      <CatalogVisual />
    </section>
  );
}
