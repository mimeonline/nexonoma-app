import { Card, CardContent, CardHeader, CardIcon, CardTitle } from "@/components/ui/atoms/Card"; // CardContent importieren!
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { GitFork, Network, ShieldAlert } from "lucide-react";

export function ValueProposition() {
  return (
    <section>
      <SectionTitle
        title="Vom Chaos zur Klarheit"
        description="Nexonoma ist keine Datenbank, sondern ein intelligentes Navigationssystem für komplexe Umgebungen."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Feature 1 */}
        <Card variant="glow" className="h-full flex flex-col">
          <CardHeader>
            <CardIcon className="bg-nexo-aqua/10 text-nexo-aqua border-nexo-aqua/20">
              <GitFork className="h-5 w-5" />
            </CardIcon>
            <CardTitle>Alternativen finden</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-nexo-muted leading-relaxed">
              Statt isolierter Tools zeigt Nexonoma passende Patterns und Technologien für deinen spezifischen Kontext.
            </p>
          </CardContent>
        </Card>

        {/* Feature 2 */}
        <Card variant="glow" className="h-full flex flex-col">
          <CardHeader>
            <CardIcon className="bg-nexo-ocean/10 text-nexo-ocean border-nexo-ocean/20">
              <Network className="h-5 w-5" />
            </CardIcon>
            <CardTitle>Kontext verstehen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-nexo-muted leading-relaxed">
              Erkenne, wie Business-Anforderungen, Code-Qualität und Team-Strukturen (Conway's Law) zusammenhängen.
            </p>
          </CardContent>
        </Card>

        {/* Feature 3 */}
        <Card variant="glow" className="h-full flex flex-col">
          <CardHeader>
            <CardIcon className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              <ShieldAlert className="h-5 w-5" />
            </CardIcon>
            <CardTitle>Risiken minimieren</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-nexo-muted leading-relaxed">
              Vermeide teure Fehlentscheidungen durch Sichtbarkeit von Abhängigkeiten und "Tech Debt"-Fallen.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
