import { AssetType } from '../../../domain/types/asset-enums';
import type { LocalizedTagDto } from '../assets/localized-tag.dto';
import type { GridSegmentContentDto } from './grid-segment-content.dto';

export type GridSegmentDto = {
  id: string;
  type: AssetType | string;
  slug: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  icon?: string;
  tags?: LocalizedTagDto[];
  tagOrder?: string[];
  content: GridSegmentContentDto;
};
