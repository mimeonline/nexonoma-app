import { AssetType } from '../../../domain/types/asset-enums';
import { MatrixMode, MatrixPerspective } from './matrix.types';

type MatrixBaseQuery = {
  clusterId: string;
  contentTypes: AssetType[];
  lang: string;
  cellLimit: number;
  xIds?: string[];
  yClusterId?: string;
};

export type GetMatrixQuery =
  | (MatrixBaseQuery & {
      mode: MatrixMode.SEGMENT_BY_SEGMENT;
      perspective?: MatrixPerspective;
      yClusterId: string;
    })
  | (MatrixBaseQuery & {
      mode: MatrixMode.SEGMENT_BY_PERSPECTIVE;
      perspective: MatrixPerspective;
    })
  | (MatrixBaseQuery & {
      mode: MatrixMode.ROLE_BY_PERSPECTIVE;
      perspective: MatrixPerspective;
      xIds: string[];
    });
