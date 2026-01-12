import { Injectable, NotFoundException } from '@nestjs/common';
import { GridRepositoryPort } from '../../ports/grid/grid-repository.port';
import type { GridClustersResponseDto } from '../../dtos/grid/clusters-response.dto';
import { GridDtoBuilder } from './grid.dto-builder';

// TODO: childrenCount zählt aktuell ClusterViews.
// Da ClusterView im UI noch nicht dargestellt wird,
// wirkt der Count auf der Cluster-Seite irreführend.
// Korrekt, sobald ClusterView-Ebene umgesetzt ist.
@Injectable()
export class GetGridClustersUseCase {
  constructor(private readonly gridRepo: GridRepositoryPort) {}

  async execute(
    locale: string,
    macroSlug: string,
  ): Promise<GridClustersResponseDto> {
    // 1. Hole das MacroCluster selbst (für den Titel/Header der Page)
    const macroCluster = await this.gridRepo.findStructuralBySlug(
      locale,
      macroSlug,
    );

    if (!macroCluster) {
      throw new NotFoundException(
        `MacroCluster with slug '${macroSlug}' not found`,
      );
    }

    // 2. Hole die Kinder (Cluster)
    if (!macroCluster.id) {
      throw new NotFoundException(
        `MacroCluster with slug '${macroSlug}' is missing id`,
      );
    }

    const clusters = await this.gridRepo.findChildren(
      locale,
      macroCluster.id,
    );

    const clusterDtos = clusters.map((cluster) =>
      GridDtoBuilder.buildNode(cluster, locale),
    );

    return GridDtoBuilder.buildNode(macroCluster, locale, clusterDtos);
  }
}
