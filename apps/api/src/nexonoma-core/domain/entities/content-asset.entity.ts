import { AssetBlock, AssetBlockProps } from './asset.entity';

// --- 1. Interfaces für komplexe verschachtelte Objekte (Value Objects) ---

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
  assets?: string[]; // Referenzierte Asset IDs oder Slugs
}

export interface TradeoffFactor {
  factor: string; // z.B. 'Maintainability'
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

// --- 2. Props Interface für den Konstruktor ---
// Erbt von AssetBlockProps und fügt alle Content-spezifischen Felder hinzu.
export interface ContentAssetProps extends AssetBlockProps {
  // Komplexe Strukturen
  useCases?: UseCase[];
  scenarios?: Scenario[];
  examples?: Example[];
  resources?: ExternalResource[];
  tradeoffMatrix?: TradeoffFactor[];
  metrics?: Metric[];

  // Klassifizierungen (Enums im Schema als Strings)
  maturityLevel?: string; // 'exploratory' | 'emerging' | 'established' | 'deprecated'
  complexityLevel?: string; // 'low' | 'medium' | 'high'
  impacts?: string; // 'technical' | 'business' | 'organizational'
  decisionType?: string; // 'pattern-selection' | 'architecture-style' | 'org-structure'
  organizationalMaturity?: string; // 'foundation' | 'intermediate' | 'advanced'
  valueStreamStage?: string; // 'discovery' | 'build' | 'run' | 'iterate'
  cognitiveLoad?: string; // 'low' | 'medium' | 'high'

  // Listen (Arrays von Strings)
  principles?: string[];
  inputs?: string[];
  outputs?: string[];
  integrations?: string[];
  architecturalDrivers?: string[]; // 'availability', 'scalability' etc.
  bottleneckTags?: string[];
  benefits?: string[];
  limitations?: string[];
  requiredSkills?: string[];
  implementationSteps?: string[];
  preconditions?: string[];
  risks?: string[];
  bestPractices?: string[];
  antiPatterns?: string[];
  techDebts?: string[];
  misuseExamples?: string[];
  traps?: string[];
  constraints?: string[];

  // Spezifisch für Tools (aus tool.schema.json)
  vendor?: string;
}

/**
 * Repräsentiert: assetblock-content.schema.json
 * Wird verwendet für: Concept, Method, Tool, Technology
 */
export class ContentAsset extends AssetBlock {
  // --- Komplexe Strukturen ---
  public useCases: UseCase[];
  public scenarios: Scenario[];
  public examples: Example[];
  public resources: ExternalResource[];
  public tradeoffMatrix: TradeoffFactor[];
  public metrics: Metric[];

  // --- Klassifizierungen ---
  public maturityLevel?: string;
  public complexityLevel?: string;
  public impacts?: string;
  public decisionType?: string;
  public organizationalMaturity?: string;
  public valueStreamStage?: string;
  public cognitiveLoad?: string;

  // --- Listen ---
  public principles: string[];
  public inputs: string[];
  public outputs: string[];
  public integrations: string[];
  public architecturalDrivers: string[];
  public bottleneckTags: string[];
  public benefits: string[];
  public limitations: string[];
  public requiredSkills: string[];
  public implementationSteps: string[];
  public preconditions: string[];
  public risks: string[];
  public bestPractices: string[];
  public antiPatterns: string[];
  public techDebts: string[];
  public misuseExamples: string[];
  public traps: string[];
  public constraints: string[];

  // --- Tool Specifics ---
  public vendor?: string;

  constructor(props: ContentAssetProps) {
    // 1. Basis-Initialisierung via super()
    super(props);

    // 2. Content-spezifische Initialisierung
    // Wir initialisieren Arrays immer, auch wenn sie leer sind, um null-checks zu vermeiden.
    this.useCases = props.useCases || [];
    this.scenarios = props.scenarios || [];
    this.examples = props.examples || [];
    this.resources = props.resources || [];
    this.tradeoffMatrix = props.tradeoffMatrix || [];
    this.metrics = props.metrics || [];

    this.maturityLevel = props.maturityLevel;
    this.complexityLevel = props.complexityLevel;
    this.impacts = props.impacts;
    this.decisionType = props.decisionType;
    this.organizationalMaturity = props.organizationalMaturity;
    this.valueStreamStage = props.valueStreamStage;
    this.cognitiveLoad = props.cognitiveLoad;

    this.principles = props.principles || [];
    this.inputs = props.inputs || [];
    this.outputs = props.outputs || [];
    this.integrations = props.integrations || [];
    this.architecturalDrivers = props.architecturalDrivers || [];
    this.bottleneckTags = props.bottleneckTags || [];
    this.benefits = props.benefits || [];
    this.limitations = props.limitations || [];
    this.requiredSkills = props.requiredSkills || [];
    this.implementationSteps = props.implementationSteps || [];
    this.preconditions = props.preconditions || [];
    this.risks = props.risks || [];
    this.bestPractices = props.bestPractices || [];
    this.antiPatterns = props.antiPatterns || [];
    this.techDebts = props.techDebts || [];
    this.misuseExamples = props.misuseExamples || [];
    this.traps = props.traps || [];
    this.constraints = props.constraints || [];

    this.vendor = props.vendor;
  }
}
