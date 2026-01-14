import type { Overview360ItemDto } from './overview360-item.dto';

export type Overview360ResponseDto = {
  foundational: Overview360ItemDto[];
  structural: Overview360ItemDto[];
  atomic: Overview360ItemDto[];
};
