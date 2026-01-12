import type { GridOverviewItemDto } from './grid-overview-item.dto';

export type MacroClusterViewResponseDto = {
  macroCluster: GridOverviewItemDto;
  clusters: GridOverviewItemDto[];
};
