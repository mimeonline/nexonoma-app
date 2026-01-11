import type { MatrixAssetPreviewDto } from './matrix-asset-preview.dto';

export type MatrixCellDto = {
  xId: string;
  yId: string;
  count: number;
  hasMore: boolean;
  items: MatrixAssetPreviewDto[];
};
