// clusterView.ts
import { BaseAssetBlock } from "./base.assetblock";

/**
 * Spezielle Ansicht/Konfiguration eines Clusters (z. B. Framework-spezifischer Blick).
 * Schema: schemas/nodes/cluster-view.schema.json
 * Optional: framework (UI-Hinweis); clusterSlug verbindet zur Cluster-Route.
 */
export interface ClusterView extends BaseAssetBlock {
  type: "clusterView";
  clusterSlug: string;
  framework?: string;
}
