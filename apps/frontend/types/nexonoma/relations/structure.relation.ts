import { BaseRelation } from "./base.relation";

export type StructureRelationName = "BELONGS_TO" | "CONTAINS";

/**
 * Strukturelle Beziehungen (z. B. Segment belongs_to Cluster).
 * Schema: schemas/edges/relations-structure.schema.json
 */
export interface StructureRelation extends BaseRelation<StructureRelationName, "STRUCTURE"> {}
