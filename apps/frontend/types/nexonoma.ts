// src/types/nexonoma.ts

// ... (Enums und Interfaces wie oben bleiben gleich) ...

export enum AssetType {
  MACRO_CLUSTER = "MACRO_CLUSTER",
  CLUSTER = "CLUSTER",
  SEGMENT = "SEGMENT",
  CONCEPT = "CONCEPT",
  METHOD = "METHOD",
  TOOL = "TOOL",
  TECHNOLOGY = "TECHNOLOGY",
  ROLE = "ROLE",
}

export enum AssetStatus {
  DRAFT = "DRAFT",
  REVIEW = "REVIEW",
  PUBLISHED = "PUBLISHED",
  DEPRECATED = "DEPRECATED",
  ARCHIVED = "ARCHIVED",
}

export interface LocalizedTag {
  slug: string;
  label: string;
}

export interface UseCase {
  name?: string;
  description: string;
  inputs?: string[];
  outputs?: string[];
}

export interface Scenario {
  name: string;
  context?: string;
  steps?: string[];
}

export interface Example {
  name: string;
  description: string;
  assets?: string[];
}

export interface TradeoffMatrix {
  // Umbenannt von TradeoffMatrix für Klarheit im Mapper
  dimension: string;
  pros: string[];
  cons: string[];
}

export interface Metric {
  name: string;
  description: string;
}

export interface ExternalResource {
  // Umbenannt von Resource für Klarheit
  name: string;
  url: string;
}

// --- CORE ASSET DEFINITIONS ---

export interface AssetBase {
  id: string;
  slug: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  shortDescription: string;
  longDescription: string;
  icon?: string;
  license?: string;
  version: string;
  updatedAt: string;
  createdAt: string;
  author?: string;
  image?: string;
  organizationalLevel: string[];
  segmentName?: string;
  clusterName?: string;
  macroClusterName?: string;
  tags?: LocalizedTag[];
}

export interface FullAsset extends AssetBase {
  impacts?: string; // Singular im UI, Plural im Type? Mapper regelt das.
  decisionType?: string[];
  organizationalMaturity?: string[];
  valueStreamStage?: string;
  cognitiveLoad?: string;
  maturityLevel?: string;
  complexityLevel?: string;
  vendor?: string;
  principles: string[];
  architecturalDrivers: string[];
  bottleneckTags: string[];
  benefits: string[];
  limitations: string[];
  risks: string[];
  techDebts: string[];
  constraints: string[];
  bestPractices: string[];
  implementationSteps: string[];
  requiredSkills: string[];
  integrations: string[]; // Mapper achtet auf 'integration' vs 'integrations'
  technologies?: string[];
  platforms?: string[];
  inputs?: string[];
  outputs?: string[];
  useCases: UseCase[];
  scenarios: Scenario[];
  examples: Example[];
  tradeoffMatrix: TradeoffMatrix[];
  metrics: Metric[];
  resources: ExternalResource[];
  antiPatterns: string[];
  misuseExamples: string[];
  traps: string[];
}
