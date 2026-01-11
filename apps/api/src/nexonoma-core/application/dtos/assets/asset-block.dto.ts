import type { ContentAssetDto } from './content-asset.dto';
import type { ContextAssetDto } from './context-asset.dto';
import type { StructuralAssetDto } from './structural-asset.dto';

export type AssetBlockDto =
  | ContentAssetDto
  | StructuralAssetDto
  | ContextAssetDto;
