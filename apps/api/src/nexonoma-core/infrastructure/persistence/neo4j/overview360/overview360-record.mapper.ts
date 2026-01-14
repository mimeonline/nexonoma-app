import type { AssetType } from 'src/nexonoma-core/domain/types/asset-enums';

export type Overview360Record = {
  id: string;
  slug: string;
  type: AssetType;
  name?: string;
  icon?: string | null;
  shortDescription?: string;
  decisionType?: string | null;
  cognitiveLoad?: string | null;
  abstractionLevel?: string | null;
};

type NeoOverview360Data = {
  id: string;
  slug: string;
  type: AssetType;
  name?: string;
  icon?: string | null;
  shortDescription?: string;
  decisionType?: string | null;
  cognitiveLoad?: string | null;
  abstractionLevel?: string | null;
};

export class Overview360RecordMapper {
  static toRecord(assetData: NeoOverview360Data): Overview360Record {
    return {
      id: assetData.id,
      slug: assetData.slug,
      type: assetData.type,
      name: assetData.name,
      icon: assetData.icon ?? null,
      shortDescription: assetData.shortDescription,
      decisionType: assetData.decisionType ?? null,
      cognitiveLoad: assetData.cognitiveLoad ?? null,
      abstractionLevel: assetData.abstractionLevel ?? null,
    };
  }
}
