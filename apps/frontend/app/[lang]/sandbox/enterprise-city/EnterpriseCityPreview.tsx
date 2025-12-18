// apps/frontend/app/sandbox/enterprise-city/EnterpriseCityPreview.tsx
"use client";

import React, { useEffect, useRef } from "react";

interface Building {
  id: string;
  label: string;
  gridX: number;
  gridY: number;
  gridWidth: number;
  gridHeight: number;
  heightLevel: 1 | 2 | 3; // 1 = niedrig, 3 = Tower
  tone: "light" | "medium" | "dark";
}

interface CityConfig {
  cols: number;
  rows: number;
  buildings: Building[];
}

const CITY_CONFIG: CityConfig = {
  cols: 12,
  rows: 8,
  buildings: [
    // Zentraler „Campus“-Block
    {
      id: "core-platform",
      label: "Core Platform",
      gridX: 4,
      gridY: 3,
      gridWidth: 4,
      gridHeight: 2,
      heightLevel: 2,
      tone: "medium",
    },
    // Zwei hohe „Enterprise“-Towers
    {
      id: "architecture-tower",
      label: "Architecture",
      gridX: 8,
      gridY: 1,
      gridWidth: 2,
      gridHeight: 2,
      heightLevel: 3,
      tone: "dark",
    },
    {
      id: "governance-tower",
      label: "Governance",
      gridX: 2,
      gridY: 1,
      gridWidth: 2,
      gridHeight: 2,
      heightLevel: 3,
      tone: "dark",
    },
    // Kleinere Blocks rundherum
    {
      id: "tooling",
      label: "Tooling",
      gridX: 1,
      gridY: 5,
      gridWidth: 2,
      gridHeight: 2,
      heightLevel: 1,
      tone: "light",
    },
    {
      id: "practices",
      label: "Practices",
      gridX: 9,
      gridY: 5,
      gridWidth: 2,
      gridHeight: 2,
      heightLevel: 1,
      tone: "light",
    },
    {
      id: "domain-a",
      label: "Domain A",
      gridX: 5,
      gridY: 1,
      gridWidth: 2,
      gridHeight: 1,
      heightLevel: 2,
      tone: "medium",
    },
    {
      id: "domain-b",
      label: "Domain B",
      gridX: 5,
      gridY: 6,
      gridWidth: 2,
      gridHeight: 1,
      heightLevel: 2,
      tone: "medium",
    },
  ],
};

const EnterpriseCityPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // einfache Resize-Handling: Canvas-Breite an Container anpassen
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(360, rect.width * 0.5);
      drawCity(canvas, CITY_CONFIG);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} className="w-full rounded-lg bg-slate-900 border border-slate-800 shadow-inner" />
      <p className="mt-3 text-xs text-slate-500">
        Vorschau: Enterprise City als 2D-Stadtmodell. Gebäudehöhen stehen z.&nbsp;B. für Wichtigkeit oder Reifegrad, Stadtblöcke für
        Cluster/MacroCluster.
      </p>
    </div>
  );
};

export default EnterpriseCityPreview;

/**
 * Zeichnet die Enterprise City in einer top-down 2D-Ansicht
 * mit leichten „Pseudo-3D“-Schatten.
 */
function drawCity(canvas: HTMLCanvasElement, config: CityConfig) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  const padding = 40;

  // Hintergrund
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, width, height);

  // Grid-Größe
  const gridWidth = width - padding * 2;
  const gridHeight = height - padding * 2;
  const cellW = gridWidth / config.cols;
  const cellH = gridHeight / config.rows;

  // Straßen zeichnen
  drawStreets(ctx, padding, padding, gridWidth, gridHeight, config, cellW, cellH);

  // Gebäude zeichnen
  config.buildings.forEach((b) => drawBuilding(ctx, b, padding, padding, cellW, cellH));
}

function drawStreets(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
  gridWidth: number,
  gridHeight: number,
  config: CityConfig,
  cellW: number,
  cellH: number
) {
  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Straßenhintergrund
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, gridWidth, gridHeight);

  // Hauptstraßen
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  for (let c = 0; c <= config.cols; c++) {
    const x = c * cellW;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gridHeight);
    ctx.stroke();
  }
  for (let r = 0; r <= config.rows; r++) {
    const y = r * cellH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(gridWidth, y);
    ctx.stroke();
  }

  // dezente Nebenlinien
  ctx.strokeStyle = "#020617";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  for (let c = 0; c <= config.cols; c += 2) {
    const x = c * cellW;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gridHeight);
    ctx.stroke();
  }
  for (let r = 0; r <= config.rows; r += 2) {
    const y = r * cellH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(gridWidth, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBuilding(ctx: CanvasRenderingContext2D, building: Building, offsetX: number, offsetY: number, cellW: number, cellH: number) {
  const baseX = offsetX + building.gridX * cellW;
  const baseY = offsetY + building.gridY * cellH;
  const w = building.gridWidth * cellW;
  const h = building.gridHeight * cellH;

  // Höhe in px (Pseudo-3D)
  const elevation = building.heightLevel * 6;

  // Farben je Ton
  let fill = "#e5e7eb";
  let edge = "#9ca3af";
  switch (building.tone) {
    case "light":
      fill = "#e5e7eb";
      edge = "#9ca3af";
      break;
    case "medium":
      fill = "#d1d5db";
      edge = "#6b7280";
      break;
    case "dark":
      fill = "#9ca3af";
      edge = "#4b5563";
      break;
  }

  // Schatten
  ctx.save();
  ctx.fillStyle = "rgba(15,23,42,0.9)";
  ctx.beginPath();
  ctx.rect(baseX + 6, baseY + 6, w, h);
  ctx.fill();
  ctx.restore();

  // Gebäude-Körper
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = edge;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(baseX, baseY - elevation, w, h + elevation);
  ctx.fill();
  ctx.stroke();

  // Dach
  ctx.fillStyle = "#f9fafb";
  ctx.strokeStyle = edge;
  ctx.beginPath();
  ctx.rect(baseX + 4, baseY - elevation + 4, w - 8, h - 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Label
  ctx.save();
  ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#cbd5f5";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const labelX = baseX + w / 2;
  const labelY = baseY + h + 6;
  ctx.fillText(building.label, labelX, labelY);
  ctx.restore();
}
