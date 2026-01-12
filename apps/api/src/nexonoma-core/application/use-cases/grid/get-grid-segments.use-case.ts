import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetType } from '../../../domain/types/asset-enums';
import { GridRepositoryPort } from '../../ports/grid/grid-repository.port';
import type { GridSegmentsResponseDto } from '../../dtos/grid/segments-response.dto';
import { GridDtoBuilder } from './grid.dto-builder';

@Injectable()
export class GetGridSegmentsUseCase {
  constructor(private readonly gridRepo: GridRepositoryPort) {}

  async execute(
    locale: string,
    clusterSlug: string,
  ): Promise<GridSegmentsResponseDto> {
    // 1) Cluster holen
    const cluster = await this.gridRepo.findStructuralBySlug(
      locale,
      clusterSlug,
    );

    if (!cluster) {
      throw new NotFoundException(
        `Cluster with slug '${clusterSlug}' not found`,
      );
    }

    if (!cluster.id) {
      throw new NotFoundException(
        `Cluster with slug '${clusterSlug}' is missing id`,
      );
    }

    // 2) ClusterView finden (wir überspringen bewusst nur 1 Ebene)
    const firstLevelChildren = await this.gridRepo.findChildren(
      locale,
      cluster.id,
    );

    const clusterView = firstLevelChildren.find(
      (child) => child.type === AssetType.CLUSTER_VIEW,
    );

    if (!clusterView) {
      throw new NotFoundException(
        `ClusterView for Cluster '${clusterSlug}' not found`,
      );
    }

    if (!clusterView.id) {
      throw new NotFoundException(
        `ClusterView for Cluster '${clusterSlug}' is missing id`,
      );
    }

    // 3) Segmente aus dem ClusterView holen
    const viewChildren = await this.gridRepo.findChildren(
      locale,
      clusterView.id,
    );

    const segments = viewChildren.filter(
      (child) => child.type === AssetType.SEGMENT,
    );

    // 4) Inhalte der Segmente laden
    const segmentDtos: GridSegmentsResponseDto['children'] = [];
    for (const segment of segments) {
      if (!segment.id) {
        throw new NotFoundException(
          `Segment with slug '${segment.slug}' is missing id`,
        );
      }
      const contents = await this.gridRepo.findChildren(locale, segment.id);

      const contentItems = contents.filter((c) =>
        [
          AssetType.CONCEPT,
          AssetType.METHOD,
          AssetType.TOOL,
          AssetType.TECHNOLOGY,
        ].includes(c.type as AssetType),
      );

      const contentDtos = contentItems.map((item) =>
        GridDtoBuilder.buildNode(item, locale),
      );

      segmentDtos.push(GridDtoBuilder.buildNode(segment, locale, contentDtos));
    }

    // 5) Ergebnisstruktur zurückgeben: cluster -> segments -> content
    return GridDtoBuilder.buildNode(cluster, locale, segmentDtos);
  }
}
