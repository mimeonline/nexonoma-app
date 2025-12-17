import type { CatalogItem } from "@/types/catalog";
import type { AssetStatus, AssetType, LocalizedTag } from "@/types/nexonoma";
import { toArray, toObjectArray } from "@/utils/data-normalization";

/**
 * Mapper für die Katalog-Liste.
 * Ignoriert schwere Felder wie 'implementationSteps' oder 'examples'.
 */
export function mapToCatalogItem(item: any): CatalogItem {
  return {
    // 1. AssetBase Props
    id: item.id || "",
    slug: item.slug || "",
    name: item.name || "Unbenannt",
    type: item.type as AssetType,
    status: item.status as AssetStatus,
    shortDescription: item.shortDescription || "",
    icon: item.icon,
    license: item.license,

    // Navigation
    segmentName: item.segmentName,
    clusterName: item.clusterName,
    macroClusterName: item.macroClusterName,

    // Tags sicher parsen
    tags: toObjectArray<LocalizedTag>(item.tags),

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
