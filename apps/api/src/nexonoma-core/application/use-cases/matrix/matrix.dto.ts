import { AssetType } from '../../../domain/types/asset-enums';

export class MatrixMetaDto {
  clusterId: string;
  mode: string;
  perspective: string;
  lang: string;
  contentTypes: AssetType[];
  cellLimit: number;
  generatedAt: string;
}

export class MatrixAxisItemDto {
  id: string;
  label: string;
}

export class MatrixAxisDto {
  type: string;
  key: string;
  label: string;
  items: MatrixAxisItemDto[];
}

export class MatrixAxesDto {
  x: MatrixAxisDto;
  y: MatrixAxisDto;
}

export class MatrixAssetPreviewDto {
  id: string;
  type: AssetType;
  slug: string;
  name: string;
  shortDescription?: string;
  tags?: { slug: string; label: string }[];
  valueStreamStage?: string;
  decisionType?: string;
  organizationalMaturity?: string;
}

export class MatrixCellDto {
  xId: string;
  yId: string;
  count: number;
  hasMore: boolean;
  items: MatrixAssetPreviewDto[];
}

export class MatrixStatsDto {
  nonEmptyCells: number;
  totalItems: number;
}

export class MatrixResponseDto {
  meta: MatrixMetaDto;
  axes: MatrixAxesDto;
  cells: MatrixCellDto[];
  stats: MatrixStatsDto;
}
