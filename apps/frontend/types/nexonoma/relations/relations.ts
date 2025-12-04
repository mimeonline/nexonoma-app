import { BaseRelation, RelationType, RelationContext, RelationDirection, RelationPhaseHint, RelationProblemCategory, RelationProps, RelationRecommendation, RelationScenarioType, RelationSegmentTypeHint, RelationSeverity, RelationStandard, RelationContextTag } from "./base.relation";
import { StructureRelation, StructureRelationName } from "./structure.relation";
import { ContentRelation, ContentRelationName } from "./content.relation";
import { ProcessRelation, ProcessRelationName } from "./process.relation";
import { DependencyRelation, DependencyRelationName } from "./dependency.relation";

export type Relation = StructureRelation | ProcessRelation | ContentRelation | DependencyRelation;

export {
  BaseRelation,
  RelationType,
  RelationDirection,
  RelationRecommendation,
  RelationStandard,
  RelationContextTag,
  RelationSeverity,
  RelationScenarioType,
  RelationProblemCategory,
  RelationPhaseHint,
  RelationSegmentTypeHint,
  RelationProps,
  RelationContext,
  StructureRelation,
  StructureRelationName,
  ContentRelation,
  ContentRelationName,
  ProcessRelation,
  ProcessRelationName,
  DependencyRelation,
  DependencyRelationName,
};

