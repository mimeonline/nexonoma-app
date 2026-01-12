import { AssetType } from '../../../domain/types/asset-enums';
import type { LocalizedTagDto } from '../assets/localized-tag.dto';

export type GridOverviewItemDto = {
  id: string;
  type: AssetType | string;
  slug: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  icon?: string;
  tags?: LocalizedTagDto[];
  tagOrder?: string[];
  framework?: string;
  parentId?: string;
  childrenCount?: number;
};
