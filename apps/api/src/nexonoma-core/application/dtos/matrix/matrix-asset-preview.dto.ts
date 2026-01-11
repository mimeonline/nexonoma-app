import { AssetType } from '../../../domain/types/asset-enums';
import type { LocalizedTagDto } from '../assets/localized-tag.dto';

export type MatrixAssetPreviewDto = {
  id: string;
  type: AssetType;
  slug: string;
  name: string;
  shortDescription?: string;
  tags?: LocalizedTagDto[];
  valueStreamStage?: string;
  decisionType?: string;
  organizationalMaturity?: string;
};
