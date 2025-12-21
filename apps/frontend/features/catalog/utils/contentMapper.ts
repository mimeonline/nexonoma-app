// src/features/catalog/utils/contentMapper.ts
import type { ContentDetail } from "@/types/catalog";
import type { AssetStatus, AssetType, Example, ExternalResource, LocalizedTag, Metric, Scenario, TradeoffMatrix, UseCase } from "@/types/nexonoma";
import { toArray, toObjectArray } from "@/utils/data-normalization";

function getFirstSentence(text?: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/[^.!?]*[.!?]/);
  return match ? match[0].trim() : text.trim();
}

// --- MAIN MAPPER ---

// Rückgabetyp: Ein sauberes ContentDetail Objekt + optionaler heroQuote
export interface MappedContentResult {
  content: ContentDetail;
  heroQuote?: string;
}

export function mapToContentDetails(item: Partial<ContentDetail>): MappedContentResult {
  // Wir bauen das Objekt strikt nach dem ContentDetail Interface auf
  const content: ContentDetail = {
    // 1. Primitive & Base Props (mit Fallbacks)
    id: item.id || "",
    slug: item.slug || "",
    name: item.name || "Unbenannt",
    type: item.type as AssetType, // Enum Cast, hier vertrauen wir der API oder setzen Default
    status: item.status as AssetStatus,
    shortDescription: item.shortDescription || "",
    longDescription: item.longDescription || "",
    icon: item.icon,
    license: item.license,
    version: item.version || "1.0",
    updatedAt: item.updatedAt || new Date().toISOString(),
    createdAt: item.createdAt || new Date().toISOString(),
    author: item.author,
    image: item.image,

    // 2. Navigation
    segmentName: item.segmentName,
    clusterName: item.clusterName,
    macroClusterName: item.macroClusterName,

    // 3. String Arrays (Sicherheitsnetz gegen Strings aus der DB)
    tags: toObjectArray<LocalizedTag>(item.tags), // Tags sind Objekte!
    principles: toArray(item.principles),
    organizationalLevel: toArray(item.organizationalLevel),
    decisionType: toArray(item.decisionType).join(", "),
    organizationalMaturity: toArray(item.organizationalMaturity).join(", "),
    architecturalDrivers: toArray(item.architecturalDrivers),
    bottleneckTags: toArray(item.bottleneckTags),
    benefits: toArray(item.benefits),
    limitations: toArray(item.limitations),
    risks: toArray(item.risks),
    techDebts: toArray(item.techDebts),
    constraints: toArray(item.constraints),
    bestPractices: toArray(item.bestPractices),
    implementationSteps: toArray(item.implementationSteps),
    requiredSkills: toArray(item.requiredSkills),
    integrations: toArray(item.integrations), // oder item.integration checken
    technologies: toArray(item.technologies),
    platforms: toArray(item.platforms),
    inputs: toArray(item.inputs),
    outputs: toArray(item.outputs),
    antiPatterns: toArray(item.antiPatterns),
    misuseExamples: toArray(item.misuseExamples),
    traps: toArray(item.traps),

    // 4. Einzelne Strings / Nullables
    impacts: typeof item.impacts === "string" ? item.impacts : toArray(item.impacts).join(", "), // Falls API Array schickt, UI aber String will
    valueStreamStage: item.valueStreamStage,
    cognitiveLoad: item.cognitiveLoad,
    maturityLevel: item.maturityLevel,
    complexityLevel: item.complexityLevel,
    vendor: item.vendor,

    // 5. Komplexe Objekt-Arrays
    useCases: toObjectArray<UseCase>(item.useCases),
    scenarios: toObjectArray<Scenario>(item.scenarios),
    tradeoffMatrix: toObjectArray<TradeoffMatrix>(item.tradeoffMatrix),
    metrics: toObjectArray<Metric>(item.metrics),
    resources: toObjectArray<ExternalResource>(item.resources),

    // Example Special Case (Assets Array fixen)
    examples: toObjectArray<Example & { assets?: unknown }>(item.examples).map((ex) => ({
      ...ex,
      assets: toArray(ex.assets),
    })),
  };

  // Logik für Hero Quote
  const heroQuote = getFirstSentence(content.longDescription || (content.principles.length ? content.principles[0] : undefined));

  return { content, heroQuote };
}
