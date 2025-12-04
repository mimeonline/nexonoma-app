import { BaseRelation } from "./base.relation";

export type ProcessRelationName = "PRECEDES" | "BLOCKED_BY" | "ENABLES" | "INFLUENCES" | "DEPENDS_ON" | "REQUIRES";

/**
 * Prozessuale/ablaufbezogene Beziehungen.
 * Schema: schemas/edges/relations-process.schema.json
 */
export interface ProcessRelation extends BaseRelation<ProcessRelationName, "PROCESS"> {}
