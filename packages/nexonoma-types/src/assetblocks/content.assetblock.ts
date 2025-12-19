// src/lib/nexonoma/model/assetblock.implementation.ts

import { BaseAssetBlock } from "./base.assetblock";

// ---------------------------
// Primitive Unions
// ---------------------------

export type MaturityLevel =
  | "exploratory"
  | "emerging"
  | "established"
  | "deprecated";

export type ComplexityLevel = "low" | "medium" | "high";

export type ImpactLevel = "technical" | "business" | "organizational";

export type DecisionType =
  | "pattern-selection"
  | "architecture-style"
  | "org-structure";

export type OrganizationalMaturity = "foundation" | "intermediate" | "advanced";

export type ValueStreamStage = "discovery" | "build" | "run" | "iterate";

export type CognitiveLoad = "low" | "medium" | "high";

// ---------------------------
// Complex Structures
// ---------------------------

export interface UseCase {
  name: string;
  inputs?: string[];
  outputs?: string[];
}

export interface Scenario {
  name: string;
  context: string;
  steps: string[];
}

export interface Example {
  name: string;
  description: string;
  benefits?: string[];
  assets?: string[];
}

export interface ResourceLink {
  name: string;
  url: string;
}

export interface Tradeoff {
  factor: string;
  pros: string[];
  cons: string[];
}

export interface Metric {
  name: string;
  description: string;
}

// ---------------------------
// Main Implementation Schema
// ---------------------------

/**
 * Vollmodell für inhaltliche AssetBlocks.
 * Schema: schemas/nodes/assetblock-implementation.schema.json
 * Viele Felder sind optional, weil das MVP nur Teilmengen im UI rendert (Listen/Detailkarten ohne Volltext-Metadaten).
 */
export interface ContentAssetBlock extends BaseAssetBlock {
  // Arrays
  useCases?: UseCase[];
  scenarios?: Scenario[];
  examples?: Example[];
  resources?: ResourceLink[];
  principles?: string[];
  inputs?: string[];
  outputs?: string[];
  integration?: string[];

  // Levels
  maturityLevel?: MaturityLevel;
  complexityLevel?: ComplexityLevel;
  impact?: ImpactLevel;
  decisionType?: DecisionType;

  // Tradeoffs & drivers
  tradeoffMatrix?: Tradeoff[];
  architecturalDrivers?: string[];
  bottleneckTags?: string[];

  // Maturity & Lifecycle
  organizationalMaturity?: OrganizationalMaturity;
  valueStreamStage?: ValueStreamStage;

  // Benefits & Limits
  benefits?: string[];
  limitations?: string[];

  // Skills & Steps
  requiredSkills?: string[];
  implementationSteps?: string[];
  preconditions?: string[];

  // Assessment
  metrics?: Metric[];
  risks?: string[];
  bestPractices?: string[];
  antiPatterns?: string[];
  techDebts?: string[];
  misuseExamples?: string[];
  traps?: string[];
  constraints?: string[];

  cognitiveLoad?: CognitiveLoad;

  // Visuals
  icon?: string;
  image?: string;
}
