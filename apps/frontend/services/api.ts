// WICHTIG: Hier müssen die Typen importiert werden!
// Das '@/' steht für deinen src-Ordner (Standard in Next.js).
// Falls das nicht klappt, versuche den relativen Pfad: '../types/nexonoma'
import { ContentDetail, GridNode } from "@/types/nexonoma";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const NexonomaApi = {
  // --- PAGE 1: Alle Macro Cluster ---
  async getMacroClusters(): Promise<GridNode[]> {
    const res = await fetch(`${API_BASE}/grid/macros`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch macros");
    return res.json();
  },

  // --- PAGE 2: Cluster in einem Macro ---
  async getClusters(macroSlug: string): Promise<GridNode> {
    const res = await fetch(`${API_BASE}/grid/macros/${macroSlug}/clusters`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch clusters for macro: ${macroSlug}`);
    return res.json();
  },

  // --- PAGE 3: Segmente & Content in einem Cluster ---
  async getSegments(clusterSlug: string): Promise<GridNode> {
    const res = await fetch(`${API_BASE}/grid/clusters/${clusterSlug}/segments`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch segments for cluster: ${clusterSlug}`);
    return res.json();
  },

  // --- PAGE 4: Katalog Liste ---
  async getCatalog(): Promise<ContentDetail[]> {
    const res = await fetch(`${API_BASE}/catalog`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch catalog");
    return res.json();
  },

  // --- PAGE 5: Detailansicht ---
  async getContentDetail(id: string): Promise<ContentDetail> {
    const res = await fetch(`${API_BASE}/catalog/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch detail for ID: ${id}`);
    return res.json();
  },
};
