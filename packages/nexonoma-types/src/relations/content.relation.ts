import { BaseRelation } from "./base.relation";

export type ContentRelationName =
  | "RELATED_TO"
  | "ALTERNATIVE_TO"
  | "CONTRADICTS"
  | "ROOT_CAUSE_OF"
  | "STRENGTHENS"
  | "WEAKENS"
  | "IMPLEMENTED_BY"
  | "USED_BY";

/**
 * Inhaltliche/semantische Beziehungen.
 * Schema: schemas/edges/relations-content.schema.json
 */
export interface ContentRelation extends BaseRelation<ContentRelationName, "CONTENT"> {}
