// macroCluster.ts
import { BaseAssetBlock } from "./base.assetblock";

/**
 * Übergeordnete Bündelung mehrerer Cluster.
 * Schema: schemas/nodes/macro-cluster.schema.json
 * Optional: abbreviation/organizationalLevel/relations; derzeit keine zusätzlichen Pflichtfelder.
 */
export interface MacroCluster extends BaseAssetBlock {
  type: "macroCluster";
  // ggf. zusätzliche Props
}
