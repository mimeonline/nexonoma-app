import { Space_Grotesk } from "next/font/google";
import { CatalogSection } from "../organisms/CatalogSection";
import { CTABottom } from "../organisms/CTABottom";
import HeroSection from "../organisms/HeroSection";
import { Navigations } from "../organisms/Navigations";
import { ValueProposition } from "../organisms/ValueProposition";

// Fonts laden (falls nicht global layout verfügbar, hier lokal sicherstellen)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function Home() {
  return (
    <div className={`${spaceGrotesk.variable} flex flex-col gap-20 sm:gap-32`}>
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
