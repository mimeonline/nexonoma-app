import type { MatrixAxesDto } from './matrix-axes.dto';
import type { MatrixCellDto } from './matrix-cell.dto';
import type { MatrixMetaDto } from './matrix-meta.dto';
import type { MatrixStatsDto } from './matrix-stats.dto';

export type MatrixResponseDto = {
  meta: MatrixMetaDto;
  axes: MatrixAxesDto;
  cells: MatrixCellDto[];
  stats: MatrixStatsDto;
};
