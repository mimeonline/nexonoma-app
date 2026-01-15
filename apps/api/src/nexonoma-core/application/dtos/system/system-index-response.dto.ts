import type { SystemIndexItemDto } from './system-index-item.dto';

export type SystemIndexResponseDto = {
  page: number;
  limit: number;
  total: number;
  items: SystemIndexItemDto[];
};
