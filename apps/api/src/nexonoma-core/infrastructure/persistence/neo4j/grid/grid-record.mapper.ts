import { AssetType } from 'src/nexonoma-core/domain/types/asset-enums';
import { JsonHydrator } from '../shared/json.rehydrator';

export type GridNodeRecord = {
  id?: string;
  type: AssetType;
  slug: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  icon?: string;
  tags?: unknown;
  tagOrder?: string[];
  childrenCount?: number;
};

type NeoGridAssetData = {
  id?: string;
  type: AssetType;
  slug: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  icon?: string;
  tags?: unknown;
  tagOrder?: unknown;
  childrenCount?: number | string | null;
};

const normalizeTagOrder = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }
  const parsed = JsonHydrator.asArray(value);
  if (!parsed) return undefined;
  return parsed.filter((entry): entry is string => typeof entry === 'string');
};

const normalizeChildrenCount = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

export class GridRecordMapper {
  static toRecord(assetData: NeoGridAssetData): GridNodeRecord {
    return {
      id: assetData.id,
      type: assetData.type,
      slug: assetData.slug,
      name: assetData.name,
      shortDescription: assetData.shortDescription,
      longDescription: assetData.longDescription,
      icon: assetData.icon,
      tags: JsonHydrator.rehydrateJson(assetData.tags) ?? assetData.tags,
      tagOrder: normalizeTagOrder(assetData.tagOrder),
      childrenCount: normalizeChildrenCount(assetData.childrenCount),
    };
  }
}
