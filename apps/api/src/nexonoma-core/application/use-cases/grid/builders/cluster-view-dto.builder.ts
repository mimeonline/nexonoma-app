import { AssetType } from '../../../../domain/types/asset-enums';
import type { GridNodeRecord } from '../../../../infrastructure/persistence/neo4j/grid/grid-record.mapper';
import type { ClusterViewResponseDto } from '../../../dtos/grid/cluster-view-response.dto';
import type { GridSegmentContentDto } from '../../../dtos/grid/grid-segment-content.dto';
import type { GridSegmentDto } from '../../../dtos/grid/grid-segment.dto';
import { buildOverviewItem } from './grid-dto-helpers';

export type SegmentWithContent = {
  segment: GridNodeRecord;
  contentItems: GridNodeRecord[];
};

export class ClusterViewDtoBuilder {
  static build(
    cluster: GridNodeRecord,
    segments: SegmentWithContent[],
    locale: string,
  ): ClusterViewResponseDto {
    return {
      cluster: buildOverviewItem(cluster, locale),
      segments: segments.map((segment) =>
        ClusterViewDtoBuilder.buildSegment(segment, locale),
      ),
    };
  }

  private static buildSegment(
    input: SegmentWithContent,
    locale: string,
  ): GridSegmentDto {
    const content = ClusterViewDtoBuilder.groupContent(
      input.contentItems,
      locale,
    );
    const base = buildOverviewItem(input.segment, locale);

    return {
      id: base.id,
      type: base.type,
      slug: base.slug,
      name: base.name,
      shortDescription: base.shortDescription,
      longDescription: base.longDescription,
      icon: base.icon,
      tags: base.tags,
      tagOrder: base.tagOrder,
      content,
    };
  }

  private static groupContent(
    items: GridNodeRecord[],
    locale: string,
  ): GridSegmentContentDto {
    const grouped: GridSegmentContentDto = {
      methods: [],
      concepts: [],
      tools: [],
      technologies: [],
    };

    items.forEach((item) => {
      const dto = buildOverviewItem(item, locale);
      switch (item.type) {
        case AssetType.METHOD:
          grouped.methods.push(dto);
          break;
        case AssetType.CONCEPT:
          grouped.concepts.push(dto);
          break;
        case AssetType.TOOL:
          grouped.tools.push(dto);
          break;
        case AssetType.TECHNOLOGY:
          grouped.technologies.push(dto);
          break;
        default:
          break;
      }
    });

    return grouped;
  }
}
