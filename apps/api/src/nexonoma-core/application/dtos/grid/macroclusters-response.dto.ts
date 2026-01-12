import { AssetType } from 'src/nexonoma-core/domain/types/asset-enums';
import { LocalizedTagDto } from '../assets/localized-tag.dto';

export type GridMacroclustersResponseDto = {
  id: string;
  type: AssetType | string;
  slug: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  icon?: string;
  tags?: LocalizedTagDto[];
  tagOrder?: string[];
  childrenCount?: number;
};
