import { cn } from "@/lib/utils";

interface CityBuildingProps {
  name: string;
  type: "concept" | "method" | "tool" | "technology";
  maturity: "low" | "medium" | "high"; // Bestimmt die Höhe
  impact: "low" | "high"; // Bestimmt die Breite
}

const colorMap = {
  concept: "bg-nexo-ocean shadow-[0_0_15px_rgba(56,189,248,0.4)]",
  method: "bg-nexo-aqua shadow-[0_0_15px_rgba(79,244,224,0.4)]",
  tool: "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
  technology: "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]",
};

const heightMap = {
  low: "h-8", // Assess
  medium: "h-16", // Trial
  high: "h-24", // Adopt
};

const widthMap = {
  low: "w-10",
  high: "w-16",
};

export function CityBuilding({ name, type, maturity, impact }: CityBuildingProps) {
  return (
    <div className="group relative transition-transform hover:-translate-y-2 duration-300">
      {/* Tooltip Simulation (Name beim Hover) */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-1 rounded border border-white/10 pointer-events-none">
        {name}
      </div>

      {/* The 3D Building Body */}
      <div className={cn("relative transition-all duration-500 ease-out", heightMap[maturity], widthMap[impact])}>
        {/* Front Face */}
        <div className={cn("absolute inset-0 rounded-sm opacity-80 border-t border-white/20", colorMap[type])} />

        {/* Right Face (Side) - CSS 3D Trickery usually requires more divs, 
            but for a simple 2.5D look, we use shadows and borders or a stacked approach. 
            Hier eine vereinfachte Version für "Flat Isometric".
        */}

        {/* Top/Roof (Leuchtet) */}
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-white/40")} />

        {/* Windows / Detail Texture (Optional) */}
        <div className="absolute inset-2 flex flex-col gap-1 opacity-20">
          <div className="flex-1 bg-black/20"></div>
          <div className="flex-1 bg-black/20"></div>
        </div>
      </div>

      {/* Floor Shadow */}
      <div className="absolute -bottom-4 left-0 right-0 h-4 bg-black/40 blur-md rounded-full transform scale-x-75"></div>
    </div>
  );
}
