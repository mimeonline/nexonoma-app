import type { CatalogItem } from "@/types/catalog";
import type { AssetStatus, AssetType, LocalizedTag } from "@/types/nexonoma";
import { toArray, toObjectArray, toTagMap } from "@/utils/data-normalization";

type CatalogItemInput = Partial<CatalogItem> & {
  tags?: unknown;
  tagOrder?: unknown;
  organizationalMaturity?: unknown;
  decisionType?: unknown;
  principles?: unknown;
  organizationalLevel?: unknown;
  impacts?: unknown;
  impact?: unknown;
};

/**
 * Mapper für die Katalog-Liste.
 * Ignoriert schwere Felder wie 'implementationSteps' oder 'examples'.
 */
export function mapToCatalogItem(item: CatalogItemInput): CatalogItem {
  return {
    // 1. AssetBase Props
    id: item.id || "",
    slug: item.slug || "",
    name: item.name || "Unbenannt",
    type: item.type as AssetType,
    status: item.status as AssetStatus,
    shortDescription: item.shortDescription || "",
    longDescription: item.longDescription || "",
    icon: item.icon,
    license: item.license,
    version: item.version || "",
    updatedAt: item.updatedAt || "",
    createdAt: item.createdAt || "",

    // Navigation
    segmentName: item.segmentName,
    clusterName: item.clusterName,
    macroClusterName: item.macroClusterName,

    // Tags sicher parsen
    tags: toObjectArray<LocalizedTag>(item.tags),
    tagsMap: toTagMap(item.tags),
    tagOrder: toArray(item.tagOrder),

    // 2. Extended Props für die Karten-Vorschau
    maturityLevel: item.maturityLevel,
    complexityLevel: item.complexityLevel,
    cognitiveLoad: item.cognitiveLoad,
    valueStreamStage: item.valueStreamStage,

    // Arrays sicherstellen
    organizationalMaturity: toArray(item.organizationalMaturity),
    decisionType: toArray(item.decisionType),
    principles: toArray(item.principles),
    organizationalLevel: toArray(item.organizationalLevel),

    // Mapping von singular/plural Unschärfen der API
    impacts: typeof item.impacts === "string" ? item.impacts : toArray(item.impact || item.impacts).join(", "),
  };
}
