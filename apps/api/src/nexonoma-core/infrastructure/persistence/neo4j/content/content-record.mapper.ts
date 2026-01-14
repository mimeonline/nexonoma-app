import type { AssetType } from 'src/nexonoma-core/domain/types/asset-enums';
import { JsonHydrator } from '../shared/json.rehydrator';

export type ContentAssetBlockRecord = {
  id: string;
  slug: string;
  type: AssetType;
  name?: string;
  icon?: string | null;
  tags?: unknown;
  tagOrder?: string[];
  shortDescription?: string;
  longDescription?: string;
  organizationalLevel?: string[] | string;
  organizationalMaturity?: string | null;
  impacts?: string | null;
  decisionType?: string | null;
  complexityLevel?: string | null;
  valueStreamStage?: string | null;
  maturityLevel?: string | null;
  cognitiveLoad?: string | null;
};

export type ContentStructureNodeRecord = {
  name?: string;
  slug?: string;
};

export type ContentStructureSegmentRecord = ContentStructureNodeRecord & {
  tags?: unknown;
  tagOrder?: string[];
};

export type ContentStructurePathRecord = {
  macroCluster?: ContentStructureNodeRecord;
  cluster?: ContentStructureNodeRecord;
  segment?: ContentStructureSegmentRecord;
};

export type ContentRelationNodeRecord = {
  id: string;
  type: AssetType;
  slug: string;
  name?: string;
  icon?: string | null;
};

export type ContentRelationRecord = {
  id: string;
  type?: string | null;
  relation?: string | null;
  node: ContentRelationNodeRecord;
};

export type ContentRecord = {
  assetBlock: ContentAssetBlockRecord;
  structurePaths: ContentStructurePathRecord[];
  relations: ContentRelationRecord[];
};

const normalizeTagOrder = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }
  const parsed = JsonHydrator.asArray(value);
  if (!parsed) return undefined;
  return parsed.filter((entry): entry is string => typeof entry === 'string');
};

const normalizeTags = (value: unknown): unknown =>
  JsonHydrator.rehydrateJson(value) ?? value;

export class ContentRecordMapper {
  static toAssetBlockRecord(assetData: any): ContentAssetBlockRecord {
    return {
      id: assetData.id,
      slug: assetData.slug,
      type: assetData.type,
      name: assetData.name,
      icon: assetData.icon ?? null,
      tags: normalizeTags(assetData.tags),
      tagOrder: normalizeTagOrder(assetData.tagOrder),
      shortDescription: assetData.shortDescription,
      longDescription: assetData.longDescription,
      organizationalLevel: assetData.organizationalLevel,
      organizationalMaturity: assetData.organizationalMaturity ?? null,
      impacts: assetData.impacts ?? null,
      decisionType: assetData.decisionType ?? null,
      complexityLevel: assetData.complexityLevel ?? null,
      valueStreamStage: assetData.valueStreamStage ?? null,
      maturityLevel: assetData.maturityLevel ?? null,
      cognitiveLoad: assetData.cognitiveLoad ?? null,
    };
  }

  static toStructurePathRecord(
    macroData: any,
    clusterData: any,
    segmentData: any,
  ): ContentStructurePathRecord {
    const macro = macroData
      ? {
          name: macroData.name,
          slug: macroData.slug,
        }
      : undefined;

    const cluster = clusterData
      ? {
          name: clusterData.name,
          slug: clusterData.slug,
        }
      : undefined;

    const segment = segmentData
      ? {
          name: segmentData.name,
          slug: segmentData.slug,
          tags: normalizeTags(segmentData.tags),
          tagOrder: normalizeTagOrder(segmentData.tagOrder),
        }
      : undefined;

    return {
      macroCluster: macro,
      cluster,
      segment,
    };
  }

  static toRelationRecord(relationData: any): ContentRelationRecord {
    return {
      id: relationData.id,
      type: relationData.type ?? null,
      relation: relationData.relation ?? null,
      node: {
        id: relationData.node?.id,
        type: relationData.node?.type,
        slug: relationData.node?.slug,
        name: relationData.node?.name,
        icon: relationData.node?.icon ?? null,
      },
    };
  }
}
