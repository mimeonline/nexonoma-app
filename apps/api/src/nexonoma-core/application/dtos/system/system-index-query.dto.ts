import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';

export type SystemIndexQueryDto = {
  page: number;
  limit: number;
  status?: AssetStatus;
  types: AssetType[];
  languages: string[];
};
