import type { GridOverviewItemDto } from './grid-overview-item.dto';

export type GridSegmentContentDto = {
  methods: GridOverviewItemDto[];
  concepts: GridOverviewItemDto[];
  tools: GridOverviewItemDto[];
  technologies: GridOverviewItemDto[];
};
