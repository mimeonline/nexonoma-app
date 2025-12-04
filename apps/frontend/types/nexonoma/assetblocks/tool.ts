// content.ts
import { ContentAssetBlock } from "./content.assetblock";

/**
 * Tools (Software/Werkzeuge zur Umsetzung von Konzepten/Methoden).
 * Schema: schemas/nodes/tool.schema.json
 * Optional: vendor sowie alle Content-Attribute; MVP nutzt primär Basisfelder + shortDescription.
 */
export interface Tool extends ContentAssetBlock {
  type: "tool";
  vendor?: string;
  // plus implementation-Felder
}
