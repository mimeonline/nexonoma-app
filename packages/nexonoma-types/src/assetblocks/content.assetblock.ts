// src/lib/nexonoma/model/assetblock.implementation.ts

import { BaseAssetBlock } from "./base.assetblock";

// ---------------------------
// Primitive Unions
// ---------------------------

export type MaturityLevel = "exploratory" | "emerging" | "established" | "deprecated";

export type ComplexityLevel = "low" | "medium" | "high";

export type ImpactLevel = "technical" | "business" | "organizational";

export type DecisionType = "pattern-selection" | "architecture-style" | "org-structure";

export type ArchitecturalDriver =
  | "availability"
  | "complexity-reduction"
  | "cost-efficiency"
  | "delivery-speed"
  | "domain-alignment"
  | "extensibility"
  | "fault-tolerance"
  | "interoperability"
  | "maintainability"
  | "observability"
  | "operational-efficiency"
  | "performance"
  | "portability"
  | "reliability"
  | "scalability"
  | "security"
  | "team-cognitive-load"
  | "testability"
  | "time-to-market";

export type BottleneckTag =
  | "latency"
  | "throughput"
  | "scalability"
  | "availability"
  | "consistency"
  | "memory-pressure"
  | "cpu-pressure"
  | "storage-io"
  | "network-io"
  | "db-queries"
  | "locking-contention"
  | "performance-degradation"
  | "observability-gap"
  | "deployment-complexity"
  | "domain-coupling"
  | "boundary-mismatch"
  | "integration-sprawl"
  | "event-chaos"
  | "pattern-misuse"
  | "microservice-overhead"
  | "monolith-bloat"
  | "version-drift"
  | "legacy-blocker"
  | "team-dependencies"
  | "silo-effects"
  | "unclear-ownership"
  | "ownership-gaps"
  | "role-ambiguity"
  | "handoff-delays"
  | "review-waiting"
  | "delivery-bottleneck"
  | "process-friction"
  | "low-autonomy"
  | "governance-gap"
  | "resistance-to-change"
  | "low-maturity"
  | "team-communication"
  | "organizational-alignment"
  | "slow-feedback-loop"
  | "missing-tests"
  | "manual-process"
  | "release-complexity"
  | "lack-of-standards"
  | "no-shared-language"
  | "unclear-scope"
  | "value-stream-break"
  | "high-cognitive-load"
  | "ambiguous-domain"
  | "poor-documentation"
  | "domain-complexity"
  | "tooling-limitations"
  | "skill-gap";

export type OrganizationalMaturity = "foundation" | "intermediate" | "advanced";

export type ValueStreamStage = "discovery" | "build" | "run" | "iterate";

export type CognitiveLoad = "low" | "medium" | "high";

// ---------------------------
// Complex Structures
// ---------------------------

export interface UseCase {
  description: string;
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
  architecturalDrivers?: ArchitecturalDriver[];
  bottleneckTags?: BottleneckTag[];

  // Maturity & Lifecycle
  organizationalMaturity?: OrganizationalMaturity;
  valueStreamStage?: ValueStreamStage;

  // Benefits & Limits
  benefits?: string[];
  limitations?: string[];
  alternatives?: string[];

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
