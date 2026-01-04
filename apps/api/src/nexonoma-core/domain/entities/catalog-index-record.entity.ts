import { AssetStatus, AssetType } from '../types/asset-enums';

export type CatalogIndexRecord = {
  id: string;
  type: AssetType;
  slug: string;
  status: AssetStatus;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  language: string;
};
