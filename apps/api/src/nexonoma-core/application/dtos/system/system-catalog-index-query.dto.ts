import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';

export type SystemCatalogIndexQueryDto = {
  page: number;
  limit: number;
  status?: AssetStatus;
  types: AssetType[];
  languages: string[];
};
