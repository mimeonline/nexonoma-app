import { AssetType } from '../../../domain/types/asset-enums';
import type { MatrixScopeDto } from './matrix-scope.dto';

export type MatrixMetaDto = {
  clusterId: string;
  mode: string;
  perspective: string;
  lang: string;
  contentTypes: AssetType[];
  cellLimit: number;
  generatedAt: string;
  scope?: MatrixScopeDto;
};
