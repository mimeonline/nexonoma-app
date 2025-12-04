// Common relation model derived from schemas/edges/relations-base.schema.json

export type RelationType = "STRUCTURE" | "PROCESS" | "CONTENT" | "DEPENDENCY";

export type RelationDirection = "uni" | "bi";

export type RelationRecommendation = "strong" | "default" | "weak" | "avoid";

export type RelationStandard = "mandatory" | "preferred" | "allowed" | "prohibited";

export type RelationContextTag = "regulated" | "startup" | "low-latency" | "enterprise" | "safety-critical" | "decision-context";

export type RelationSeverity = "low" | "medium" | "high" | "critical";

export type RelationScenarioType = "diagnosis" | "decision" | "discovery" | "delivery" | "strategy" | "runtime";

export type RelationProblemCategory =
  | "performance"
  | "scalability"
  | "alignment"
  | "architecture"
  | "team-dynamics"
  | "organizational-friction"
  | "process-issues"
  | "integration"
  | "governance"
  | "unknown";

export type RelationPhaseHint =
  | "discovery"
  | "analysis"
  | "design"
  | "implementation"
  | "validation"
  | "delivery"
  | "operations"
  | "strategy";

export type RelationSegmentTypeHint = "phase" | "activity" | "task" | "milestone" | "stream" | "lane";

export interface RelationProps {
  weight?: number;
  recommendation?: RelationRecommendation;
  standard?: RelationStandard;
  rationale?: string;
  context?: RelationContextTag;
  confidence?: number;
  severity?: RelationSeverity;
}

export interface RelationContext {
  label?: string;
  segmentTypeHint?: RelationSegmentTypeHint;
  order?: number;
  laneId?: string;
  streamId?: string;
  scenarioType?: RelationScenarioType;
  problemCategory?: RelationProblemCategory;
  phaseHint?: RelationPhaseHint;
  laneHint?: string;
}

/**
 * Basismodell für Relationen (alle Typen). Felder direction/version/props/context sind laut Schema optional und werden UI-seitig nur bei Bedarf gesetzt.
 * Schema: schemas/edges/relations-base.schema.json
 */
export interface BaseRelation<Name extends string = string, Type extends RelationType = RelationType> {
  type: Type;
  relation: Name;
  sourceID: string;
  targetID: string;
  sourceSlug: string;
  targetSlug: string;
  direction?: RelationDirection;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  props?: RelationProps;
  context?: RelationContext;
}
