import { AssetType } from '../../../domain/types/asset-enums';
import { MatrixMode, MatrixPerspective } from './matrix.types';

export type GetMatrixQuery = {
  clusterId: string;
  mode: MatrixMode;
  perspective: MatrixPerspective;
  contentTypes: AssetType[];
  lang: string;
  cellLimit: number;
  xIds?: string[];
};
