// cluster.ts
import { BaseAssetBlock } from "./base.assetblock";

export type ClusterCategory =
  | "Strategie & Organisation"
  | "Software & Architektur"
  | "Technologie & Infrastruktur"
  | "Data & Intelligence"
  | "User & Kontext";

/**
 * Cluster-Knoten (Themenbereiche).
 * Schema: schemas/nodes/cluster.schema.json
 * Optional: abbreviation/organizationalLevel/relations aus Basistyp; category ist verpflichtend und steuert UI-Gruppierungen.
 */
export interface Cluster extends BaseAssetBlock {
  type: "cluster";
  category: ClusterCategory;
}
