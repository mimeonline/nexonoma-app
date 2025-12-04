// content.ts
import { ContentAssetBlock } from "./content.assetblock";

/**
 * Technologien (Frameworks, Plattformen, Sprachen).
 * Schema: schemas/nodes/technology.schema.json
 * Optionale Content-Felder decken Reifegrad/Risiken/Integration ab, UI kann Teilmengen rendern.
 */
export interface Technology extends ContentAssetBlock {
  type: "technology";
  // plus implementation-Felder
}
