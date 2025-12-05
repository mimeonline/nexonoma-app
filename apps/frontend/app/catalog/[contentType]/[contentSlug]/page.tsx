import { ContentDetails, type ContentDetailsData } from "@/features/catalog/templates/ContentDetails";
import { NexonomaApi } from "@/services/api";
import type { CatalogContentType } from "@/types/catalog";
import type { ContentDetail, Example, ExternalResource, Metric, Scenario, TradeoffFactor, UseCase } from "@/types/nexonoma";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ contentType: CatalogContentType; contentSlug: string }> | { contentType: CatalogContentType; contentSlug: string };
};

type ContentModelData = Partial<ContentDetail> & {
  goals?: string[] | string;
  bestPractices?: string[] | string;
  inputs?: string[] | string;
  outputs?: string[] | string;
  constraints?: string[] | string;
  technologies?: string[] | string;
  platforms?: string[] | string;
  useCases?: UseCase[] | UseCase | string;
  scenarios?: Scenario[] | Scenario | string;
  examples?: Example[] | Example | string;
  resources?: ExternalResource[] | ExternalResource | string;
  metrics?: Metric[] | Metric | string;
  tradeoffMatrix?: TradeoffFactor[] | TradeoffFactor | string;
  impact?: string[] | string;
  decisionType?: string[] | string;
  complexityLevel?: string[] | string;
  organizationalMaturity?: string[] | string;
};

function toArray<T = string>(value: unknown): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") return [value as unknown as T];
  if (typeof value === "object") return Object.values(value) as T[];
  return [];
}

function toObjectArray<T extends object>(value: unknown): T[] {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((entry) => entry && typeof entry === "object") as T[];
      }
      if (parsed && typeof parsed === "object") {
        return [parsed as T];
      }
    } catch {
      return [];
    }
  }
  return toArray<T>(value).filter((entry) => entry && typeof entry === "object");
}

function firstSentence(text?: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/[^.!?]*[.!?]/);
  return match ? match[0].trim() : text.trim();
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { contentType, contentSlug } = await params;

  let item: ContentModelData | null = null;
  try {
    item = (await NexonomaApi.getContentBySlug(contentType, contentSlug)) as ContentModelData;
  } catch (error) {
    return notFound();
  }

  if (!item) return notFound();

  const content: ContentDetailsData = {
    tags: toArray<string>(item.tags),
    principles: toArray<string>(item.principles),
    goals: toArray<string>(item.goals),
    organizationalLevel: toArray<string>(item.organizationalLevel),
    useCases: toObjectArray<UseCase>(item.useCases),
    scenarios: toObjectArray<Scenario>(item.scenarios),
    examples: toObjectArray<Example>(item.examples).map((example) => ({
      ...example,
      assets: toArray<string>((example as { assets?: unknown }).assets),
    })),
    risks: toArray<string>(item.risks),
    traps: toArray<string>(item.traps),
    antiPatterns: toArray<string>(item.antiPatterns),
    bestPractices: toArray<string>(item.bestPractices),
    inputs: toArray<string>(item.inputs),
    outputs: toArray<string>(item.outputs),
    resources: toObjectArray<ExternalResource>(item.resources),
    metrics: toObjectArray<Metric>(item.metrics),
    constraints: toArray<string>(item.constraints),
    integration: toArray<string>(item.integration),
    alternatives: toArray<string>(item.alternatives),
    technologies: toArray<string>(item.technologies),
    platforms: toArray<string>(item.platforms),
    valueStreamStage: typeof item.valueStreamStage === "string" ? item.valueStreamStage : undefined,
    architecturalDrivers: toArray<string>(item.architecturalDrivers),
    benefits: toArray<string>(item.benefits),
    limitations: toArray<string>(item.limitations),
    implementationSteps: toArray<string>(item.implementationSteps),
    techDebts: toArray<string>(item.techDebts),
    bottleneckTags: toArray<string>(item.bottleneckTags),
    misuseExamples: toArray<string>(item.misuseExamples),
    requiredSkills: toArray<string>(item.requiredSkills),
    tradeoffMatrix: toObjectArray<TradeoffFactor>(item.tradeoffMatrix),
    cognitiveLoad: typeof item.cognitiveLoad === "string" ? item.cognitiveLoad : undefined,
    status: typeof item.status === "string" ? item.status : undefined,
    impact: toArray<string>(item.impact),
    decisionType: toArray<string>(item.decisionType),
    complexityLevel: toArray<string>(item.complexityLevel),
    organizationalMaturity: toArray<string>(item.organizationalMaturity),
    shortDescription: typeof item.shortDescription === "string" ? item.shortDescription : "",
    longDescription: typeof item.longDescription === "string" ? item.longDescription : "",
    segmentName: undefined,
    clusterName: undefined,
    macroClusterName: undefined,
    name: typeof item.name === "string" ? item.name : "",
    maturityLevel: typeof item.maturityLevel === "string" ? item.maturityLevel : "",
  };

  const icon = item.icon;

  const heroQuote = firstSentence(
    content.longDescription ||
      (content.principles.length ? content.principles[0] : undefined) ||
      (content.goals.length ? content.goals[0] : undefined)
  );

  return <ContentDetails contentType={contentType} icon={icon} heroQuote={heroQuote} content={content} />;
}
