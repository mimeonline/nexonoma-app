// src/types/grid.ts
import { AssetBase, AssetType } from "./nexonoma";

/**
 * GridAssetBase:
 * Eine "Light"-Version von AssetBase für die Grid-Ansicht.
 * Wir nutzen Pick, um nur die Felder zu übernehmen, die im Grid tatsächlich vorhanden sind.
 * Status, Version, CreatedAt etc. lassen wir weg, da sie den Mapper kaputt machen würden.
 */
export interface GridAssetBase extends Pick<AssetBase, "id" | "slug" | "name" | "shortDescription" | "longDescription" | "icon"> {
  // Type ist hier explizit, damit wir es überschreiben können
  type: AssetType | string;
  tags?: unknown;
  tagsMap?: Record<string, { de: string; en: string }>;
  tagOrder?: string[];
}

/**
 * SegmentContentItem:
 * Das "Blatt" im Baum (z.B. eine Methode oder ein Tool).
 */
export type SegmentContentItem = GridAssetBase;

/**
 * SegmentContentType:
 * Definiert die Arten von Inhalten.
 * Wir nutzen hier die Enum-Werte.
 */
export type SegmentContentType = AssetType.CONCEPT | AssetType.METHOD | AssetType.TOOL | AssetType.TECHNOLOGY;

export interface SegmentContent {
  methods: SegmentContentItem[];
  concepts: SegmentContentItem[];
  tools: SegmentContentItem[];
  technologies: SegmentContentItem[];
}

export interface Segment extends GridAssetBase {
  type: AssetType.SEGMENT;
  content?: SegmentContent;
  childrenCount?: number | 0;
}

export interface Cluster extends GridAssetBase {
  type: AssetType.CLUSTER;
  segments?: Segment[];
  childrenCount?: number | 0;
}
export interface ClusterView {
  cluster: Cluster;
  segments: Segment[];
}

export interface MacroCluster extends GridAssetBase {
  type: AssetType.MACRO_CLUSTER;
  children?: Cluster[]; // Beachte: Im Mapper hieß es 'clusters', im Type hier 'children'.
  // Falls du im Mapper 'clusters' nutzt, benenne das hier in 'clusters' um!
  // Konsistenz-Check: Wenn MacroCluster.tsx auf .clusters zugreift, muss es hier .clusters heißen.
  clusters?: Cluster[];
  childrenCount?: number | 0;
}

export interface MacroClusterView {
  macroCluster: MacroCluster;
  clusters: Cluster[];
}

export interface GridData {
  macroClusters: MacroCluster[];
}

export interface GridResponse {
  data: GridData;
  meta: {
    requestId: string;
    timestamp: string;
  };
}
