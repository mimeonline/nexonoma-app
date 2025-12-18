import { LocalizedTag } from '../../domain/entities/asset.entity';
import { AssetStatus, AssetType } from '../../domain/types/asset-enums';
// --- Sub-DTOs für komplexe Objekte ---

// TODO : Wir im Moment nicht genutzt. Später einbinden oder löschen.

export class UseCaseDto {
  description: string;
  inputs?: string[];
  outputs?: string[];
}

export class ScenarioDto {
  name: string;
  context: string;
  steps: string[];
}

export class ExampleDto {
  name: string;
  description: string;
  benefits?: string[];
  assets?: string[];
}

export class TradeoffFactorDto {
  factor: string;
  pros: string[];
  cons: string[];
}

export class MetricDto {
  name: string;
  description: string;
}

export class ExternalResourceDto {
  name: string;
  url: string;
}

// --- Haupt-DTO ---

export class ContentDetailDto {
  // --- Header Data ---
  id: string;
  slug: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  version: string;
  updatedAt: Date;

  // --- Visuals ---
  icon?: string;
  image?: string;

  // --- Basis Info ---
  shortDescription: string;
  longDescription: string;
  tags: LocalizedTag[];
  organizationalLevel: string[];

  // --- Metadaten (Klassifizierung) ---
  maturityLevel?: string;
  complexityLevel?: string;
  impacts?: string;
  decisionType?: string;
  organizationalMaturity?: string;
  valueStreamStage?: string;
  cognitiveLoad?: string;

  // --- Spezifisch für Tools ---
  vendor?: string;

  // --- Listen (Strings) ---
  principles: string[];
  architecturalDrivers: string[];
  bottleneckTags: string[];
  benefits: string[];
  limitations: string[];
  risks: string[];
  techDebts: string[];

  // --- Implementierung ---
  implementationSteps: string[];
  requiredSkills: string[];
  integrations: string[]; // APIs etc.

  // --- Komplexe Objekte (Sub-DTOs) ---
  useCases: UseCaseDto[];
  scenarios: ScenarioDto[];
  examples: ExampleDto[];
  tradeoffMatrix: TradeoffFactorDto[];
  metrics: MetricDto[];
  resources: ExternalResourceDto[];

  // --- Anti-Patterns & Traps ---
  antiPatterns: string[];
  misuseExamples: string[];
  traps: string[];

  constructor(partial: Partial<ContentDetailDto>) {
    Object.assign(this, partial);
  }
}
