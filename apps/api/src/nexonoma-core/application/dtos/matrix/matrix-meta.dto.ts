import { AssetType } from '../../../domain/types/asset-enums';

export type MatrixMetaDto = {
  clusterId: string;
  mode: string;
  perspective: string;
  lang: string;
  contentTypes: AssetType[];
  cellLimit: number;
  generatedAt: string;
};
