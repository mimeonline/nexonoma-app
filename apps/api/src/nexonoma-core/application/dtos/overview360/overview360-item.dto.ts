import type { AssetType } from '../../../domain/types/asset-enums';

export type Overview360ItemDto = {
  id: string;
  slug: string;
  type: AssetType;
  name: string;
  icon: string | null;
  shortDescription: string;
  decisionType: string | null;
  cognitiveLoad: string | null;
};
