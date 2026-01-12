import { AssetType } from 'src/nexonoma-core/domain/types/asset-enums';
import { LocalizedTagDto } from '../assets/localized-tag.dto';

export type CatalogResponseDto = {
  id: string;
  type: AssetType;
  slug: string;
  name: string;
  shortDescription?: string;
  tags?: LocalizedTagDto[];
};
