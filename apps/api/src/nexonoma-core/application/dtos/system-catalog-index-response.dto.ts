import type { SystemCatalogIndexItemDto } from './system-catalog-index-item.dto';

export type SystemCatalogIndexResponseDto = {
  page: number;
  limit: number;
  total: number;
  items: SystemCatalogIndexItemDto[];
};
