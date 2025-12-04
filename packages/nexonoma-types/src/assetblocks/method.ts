// content.ts
import { ContentAssetBlock } from "./content.assetblock";

/**
 * Methoden/Prozesse.
 * Schema: schemas/nodes/method.schema.json
 * Optionale Content-Felder für Schritte/Skills können leer bleiben, wenn nur Kurzinfos im UI gezeigt werden.
 */
export interface Method extends ContentAssetBlock {
  type: "method";
  // plus implementation-Felder
}
