import type { AssetBaseDto } from './asset-base.dto';
import type { AssetBlockDto } from './asset-block.dto';

export type StructuralAssetDto = AssetBaseDto & {
  framework?: string;
  parentId?: string;
  children: AssetBlockDto[];
  childrenCount: number;
};
