import { CatalogSection } from "../organisms/CatalogSection";
import { CTABottom } from "../organisms/CTABottom";
import HeroSection from "../organisms/HeroSection";
import { Navigations } from "../organisms/Navigations";
import { ValueProposition } from "../organisms/ValueProposition";

export default function HomeTemplate() {
  return (
    <div className={"flex flex-col gap-20 sm:gap-32"}>
      <HeroSection />
      {/* --- VALUE PROPOSITION: Why Nexonoma? --- */}
      <ValueProposition />
      {/* --- CATALOG SECTION (2-Column Split - Top Aligned) --- */}
      <CatalogSection />
      {/* --- NAVIGATION: The Products (Enhanced Visuals) --- */}
      <Navigations />
      {/* --- CTA BOTTOM --- */}
      <CTABottom />
    </div>
  );
}
