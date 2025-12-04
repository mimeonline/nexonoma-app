import { BaseRelation } from "./base.relation";

export type DependencyRelationName = "DEPENDS_ON" | "REQUIRES" | "IMPLEMENTED_BY" | "BLOCKED_BY";

/**
 * Abhängigkeitsbeziehungen (technisch/organisatorisch).
 * Schema: schemas/edges/relations-dependencies.schema.json
 */
export interface DependencyRelation extends BaseRelation<DependencyRelationName, "DEPENDENCY"> {}
