import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { CityBuilding } from "./CityBuilding";
import { CityDistrict } from "./CityDistrict";

export default function CityView() {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <SectionTitle
          badge="City View"
          title="Die Architektur-Metropole"
          description="Visualisiere dein Tech-Stack als Stadt. Höhe = Reifegrad, Farbe = Typ. Erkenne Cluster und Lücken."
        />

        {/* Legende ist PFLICHT für Verständnis */}
        <div className="hidden lg:flex gap-6 text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-6 bg-nexo-ocean rounded-sm"></div> Concept
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-6 bg-purple-500 rounded-sm"></div> Tool
          </div>
          <div className="border-l border-white/10 pl-4 flex items-center gap-2">
            <div className="w-2 h-3 bg-slate-600"></div> Neu
            <div className="w-2 h-8 bg-slate-600"></div> Standard
          </div>
        </div>
      </div>

      {/* Die Perspektive */}
      {/* Wir kippen das Grid nicht hart mit CSS rotateX, da Text dann schwer lesbar wird. 
          Stattdessen nutzen wir ein "Regal-Layout" (Shelf View), das wie eine Stadt-Silhouette wirkt. */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <CityDistrict title="Software & Architecture">
          <CityBuilding name="Clean Architecture" type="concept" maturity="high" impact="high" />
          <CityBuilding name="DDD" type="concept" maturity="high" impact="high" />
          <CityBuilding name="Event Storming" type="method" maturity="medium" impact="high" />
          <CityBuilding name="Microservices" type="concept" maturity="high" impact="high" />
        </CityDistrict>

        <CityDistrict title="DevOps & Infrastructure">
          <CityBuilding name="Kubernetes" type="technology" maturity="high" impact="high" />
          <CityBuilding name="Docker" type="technology" maturity="high" impact="high" />
          <CityBuilding name="ArgoCD" type="tool" maturity="medium" impact="low" />
          <CityBuilding name="Terraform" type="tool" maturity="high" impact="high" />
        </CityDistrict>

        <CityDistrict title="Data & AI">
          <CityBuilding name="Python" type="technology" maturity="high" impact="high" />
          <CityBuilding name="Kafka" type="technology" maturity="medium" impact="high" />
          <CityBuilding name="Tableau" type="tool" maturity="high" impact="low" />
        </CityDistrict>
      </div>
    </div>
  );
}
