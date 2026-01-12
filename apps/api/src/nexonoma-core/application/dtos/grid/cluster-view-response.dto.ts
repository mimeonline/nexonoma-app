import type { GridOverviewItemDto } from './grid-overview-item.dto';
import type { GridSegmentDto } from './grid-segment.dto';

export type ClusterViewResponseDto = {
  cluster: GridOverviewItemDto;
  segments: GridSegmentDto[];
};
