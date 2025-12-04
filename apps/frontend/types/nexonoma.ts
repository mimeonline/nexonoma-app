// frontend/types/nexonoma.ts

// --- ENUMS (müssen exakt zum Backend passen) ---

export enum AssetType {
  // Structure
  MACRO_CLUSTER = "macroCluster",
  CLUSTER = "cluster",
  SEGMENT = "segment",
  CLUSTER_VIEW = "clusterView",

  // Content
  CONCEPT = "concept",
  METHOD = "method",
  TOOL = "tool",
  TECHNOLOGY = "technology",

  // Context
  ROLE = "role",
}

export enum AssetStatus {
  DRAFT = "draft",
  REVIEW = "review",
  PUBLISHED = "published",
  DEPRECATED = "deprecated",
  ARCHIVED = "archived",
}

// --- SUB-INTERFACES (Value Objects für Content) ---

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

export interface TradeoffFactor {
  factor: string;
  pros: string[];
  cons: string[];
}

export interface Metric {
  name: string;
  description: string;
}

export interface ExternalResource {
  name: string;
  url: string;
}

// --- HAUPTTYPEN ---

/**
 * GridNode: Wird für die Navigation (Pages 1, 2, 3) verwendet.
 * Enthält die rekursive "children"-Struktur.
 */
export interface GridNode {
  // Identifikation
  id: string;
  slug: string;
  name: string;
  type: AssetType;

  // Visuelles & Status
  shortDescription: string;
  icon?: string;
  image?: string;
  status: AssetStatus;

  // Struktur-Spezifisches (nur bei manchen Typen vorhanden)
  category?: string; // Nur bei Clustern
  framework?: string; // Nur bei ClusterViews

  // Die Rekursion: Das Backend liefert hier die Unter-Elemente
  children: GridNode[];
}

/**
 * ContentDetail: Das volle Objekt für die Detail-Seite (Page 5).
 * Enthält ALLE Felder aus dem Content-Schema.
 */
export interface ContentDetail {
  // Header
  id: string;
  slug: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  version: string;
  updatedAt: string; // JSON Dates sind Strings im Frontend

  // Visuals
  icon?: string;
  image?: string;

  // Basis
  shortDescription: string;
  longDescription: string;
  tags: string[];
  organizationalLevel: string[];

  // Klassifizierung
  maturityLevel?: string;
  complexityLevel?: string;
  impact?: string;
  decisionType?: string;
  organizationalMaturity?: string;
  valueStreamStage?: string;
  cognitiveLoad?: string;

  // Tool Specifics
  vendor?: string;

  // Listen & Arrays
  principles: string[];
  architecturalDrivers: string[];
  bottleneckTags: string[];
  benefits: string[];
  limitations: string[];
  alternatives: string[];
  risks: string[];
  techDebts: string[];

  // Implementation
  implementationSteps: string[];
  requiredSkills: string[];
  integration: string[];

  // Komplexe Objekte
  useCases: UseCase[];
  scenarios: Scenario[];
  examples: Example[];
  tradeoffMatrix: TradeoffFactor[];
  metrics: Metric[];
  resources: ExternalResource[];

  // Anti-Patterns
  antiPatterns: string[];
  misuseExamples: string[];
  traps: string[];
}
