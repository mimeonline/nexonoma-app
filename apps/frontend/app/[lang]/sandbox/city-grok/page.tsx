"use client";

import { Box, Grid, OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";

// Baustein-Typen mit Farben (wie in der Ontologie definiert)
const BuildingType = {
  CONCEPT: { color: "#3b82f6", label: "CONCEPT" }, // blau
  METHOD: { color: "#10b981", label: "METHOD" }, // grün
  TOOL: { color: "#8b5cf6", label: "TOOL" }, // lila
  TECHNOLOGY: { color: "#f97316", label: "TECHNOLOGY" }, // orange
} as const;

type Maturity = "Assess" | "Trial" | "Adopt" | "Hold";

interface Building {
  id: string;
  name: string;
  type: keyof typeof BuildingType;
  maturity: Maturity;
  impact: number; // 1-10
  position: [number, number, number];
  size?: [number, number, number];
}

const buildings: Building[] = [
  // Core Platform (Zentrum)
  {
    id: "1",
    name: "Core Platform",
    type: "CONCEPT",
    maturity: "Adopt",
    impact: 10,
    position: [0, 0, 0],
    size: [4, 3, 4],
  },

  // Strategische Säulen
  {
    id: "2",
    name: "Domain Driven Design",
    type: "CONCEPT",
    maturity: "Adopt",
    impact: 9,
    position: [-5, 0, -5],
  },
  {
    id: "3",
    name: "Event Sourcing",
    type: "CONCEPT",
    maturity: "Adopt",
    impact: 8,
    position: [5, 0, -5],
  },
  {
    id: "4",
    name: "Kubernetes",
    type: "TECHNOLOGY",
    maturity: "Adopt",
    impact: 10,
    position: [0, 0, 6],
  },

  // Wichtige Methoden & Tools
  {
    id: "5",
    name: "Event Storming",
    type: "METHOD",
    maturity: "Adopt",
    impact: 8,
    position: [-3, 0, 2],
  },
  {
    id: "6",
    name: "ArgoCD",
    type: "TOOL",
    maturity: "Adopt",
    impact: 7,
    position: [3, 0, 3],
  },
  {
    id: "7",
    name: "Terraform",
    type: "TOOL",
    maturity: "Trial",
    impact: 6,
    position: [-2, 0, -2],
  },
  {
    id: "8",
    name: "React",
    type: "TECHNOLOGY",
    maturity: "Adopt",
    impact: 8,
    position: [2, 0, -3],
  },

  // Experimentell / Assess
  {
    id: "9",
    name: "ZIO",
    type: "TECHNOLOGY",
    maturity: "Assess",
    impact: 4,
    position: [-4, 0, 4],
  },
  {
    id: "10",
    name: "Temporal",
    type: "TOOL",
    maturity: "Trial",
    impact: 6,
    position: [4, 0, -1],
  },
];

const maturityHeight: Record<Maturity, number> = {
  Assess: 0.6,
  Trial: 1.8,
  Adopt: 3.5,
  Hold: 0.8,
};

function BuildingBlock({ building }: { building: Building }) {
  const height = maturityHeight[building.maturity] * (building.impact / 5);
  const size = building.size || [1.5, height, 1.5];
  const color = BuildingType[building.type].color;

  return (
    <group position={building.position}>
      <Box args={size} position={[0, height / 2, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </Box>
      {building.impact > 7 && (
        <Text position={[0, height + 0.5, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
          {building.name}
        </Text>
      )}
      {building.maturity === "Adopt" && building.impact > 8 && <pointLight position={[0, height + 1, 0]} intensity={3} color={color} distance={15} />}
    </group>
  );
}

function City() {
  return (
    <>
      {buildings.map((b) => (
        <BuildingBlock key={b.id} building={b} />
      ))}

      {/* Boden-Grid */}
      <Grid
        position={[0, -0.01, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#334155"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#475569"
        fadeDistance={40}
        fadeStrength={1}
      />

      {/* Bodennebel – opacity reduziert */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.5} />
      </mesh>
    </>
  );
}

export default function NexonomaCityApp() {
  return (
    <div className="relative isolate -mx-4 sm:-mx-6 lg:-mx-8 w-screen max-w-none min-h-[calc(100vh-30rem)] pb-24 bg-linear-to-b from-slate-950 to-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-8 pointer-events-none">
        <h1 className="text-5xl font-bold text-white tracking-tight">Nexonoma • Enterprise City Preview</h1>
        <p className="text-slate-400 mt-4 text-lg max-w-4xl">
          Gebäudehöhen zeigen Reifegrad & strategische Wichtigkeit • Farben = Typ (CONCEPT 🟦 METHOD 🟩 TOOL 🟪 TECHNOLOGY 🟧) • Stadtblöcke = Cluster
          & Domains
        </p>
      </div>

      {/* 3D Canvas (unterhalb des Headers halten) */}
      <div className="relative h-[calc(100vh-4.5rem)] pt-28 overflow-hidden">
        <Canvas
          className="h-full w-full"
          camera={{ position: [10, 10, 10], fov: 50, near: 0.1, far: 1000 }}
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 20, 10]} intensity={2} castShadow />
          <directionalLight position={[-10, 20, -10]} intensity={1.5} />
          <hemisphereLight args={["#ffffff", "#444444", 1]} intensity={0.8} />

          <Suspense fallback={null}>
            <City />
          </Suspense>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 0, 0]} // Fokussiert auf Zentrum
          />
        </Canvas>
      </div>

      {/* Legende */}
      <div className="absolute bottom-16 left-8 z-20 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-6 text-white">
        <h3 className="font-bold text-xl mb-4">Legende</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: BuildingType.CONCEPT.color }}></div>
            <span>CONCEPT</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: BuildingType.METHOD.color }}></div>
            <span>METHOD</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: BuildingType.TOOL.color }}></div>
            <span>TOOL</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: BuildingType.TECHNOLOGY.color }}></div>
            <span>TECHNOLOGY</span>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          Hohe Gebäude = Adopt + hoher Impact
          <br />
          Leuchtende Gebäude = Strategische Kernbausteine
        </div>
      </div>
    </div>
  );
}
