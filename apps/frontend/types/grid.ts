// types/grid.ts
import { AssetBase, AssetType } from "./nexonoma";

// Wir nutzen Pick, um nur die Felder zu nehmen, die wir im Grid brauchen,
// oder wir nutzen AssetBase direkt, wenn das Grid alles liefert.
// Hier definieren wir, dass ein SegmentContentItem eigentlich ein AssetBase ist.
export interface SegmentContentItem extends AssetBase {
  // Grid-Spezifische Erweiterungen falls nötig
}

/**
 * SegmentContentType:
 * Definiert die Arten von Inhalten, die in einem Segment liegen können.
 * Wird im 'SegmentsTemplate' für die Filter-Logik und Tabs benötigt.
 * Wir nutzen hier Strings passend zu den Keys im 'content' Objekt.
 */
export type SegmentContentType = AssetType.CONCEPT | AssetType.METHOD | AssetType.TOOL | AssetType.TECHNOLOGY;

export interface SegmentContent {
  // Hier nutzen wir Computed Properties basierend auf dem Enum,
  // oder harte Keys, wenn die API das so liefert:
  methods: SegmentContentItem[];
  concepts: SegmentContentItem[];
  tools: SegmentContentItem[];
  technologies: SegmentContentItem[];
}

export interface Segment extends AssetBase {
  type: AssetType.SEGMENT; // Type Narrowing
  content?: SegmentContent;
}

export interface Cluster extends AssetBase {
  type: AssetType.CLUSTER;
  segments: Segment[];
}

export interface MacroCluster extends AssetBase {
  type: AssetType.MACRO_CLUSTER;
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
    // ...
  };
}
