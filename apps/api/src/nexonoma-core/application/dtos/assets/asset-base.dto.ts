import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';
import type { LocalizedTagDto } from './localized-tag.dto';

export type AssetBaseDto = {
  id: string;
  slug: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  version: string;
  language: string;
  license?: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  contributor: string[];
  shortDescription: string;
  longDescription: string;
  tags: LocalizedTagDto[];
  tagOrder?: string[];
  abbreviation?: string;
  organizationalLevel: string[];
  icon?: string;
  image?: string;
};
