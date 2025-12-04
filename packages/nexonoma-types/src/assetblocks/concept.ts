// content.ts
import { ContentAssetBlock } from "./content.assetblock";

/**
 * Konzepte (Modelle, Paradigmen, Frameworks).
 * Schema: schemas/nodes/concept.schema.json
 * Optionale Felder stammen aus ContentAssetBlock (Use Cases, Tradeoffs etc.), UI nutzt meist shortDescription/name/slug.
 */
export interface Concept extends ContentAssetBlock {
  type: "concept";
  // plus Felder aus assetblock-implementation
}
