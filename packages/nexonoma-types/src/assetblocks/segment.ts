// segment.ts
import { BaseAssetBlock } from "./base.assetblock";

/**
 * Segment innerhalb eines Clusters (z. B. Phase/Teilbereich).
 * Schema: schemas/nodes/segment.schema.json
 * Optional: abbreviation/organizationalLevel/relations aus Basistyp; weitere Felder nicht vorgesehen.
 */
export interface Segment extends BaseAssetBlock {
  type: "segment";
}
