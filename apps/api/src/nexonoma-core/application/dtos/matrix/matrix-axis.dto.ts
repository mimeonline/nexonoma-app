import type { MatrixAxisItemDto } from './matrix-axis-item.dto';

export type MatrixAxisDto = {
  type: string;
  key: string;
  label: string;
  items: MatrixAxisItemDto[];
};
