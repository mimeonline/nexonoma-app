import { Injectable, NotFoundException } from '@nestjs/common';
import { StructuralAsset } from '../../../domain/entities/structural-asset.entity';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';
import { AssetType } from '../../../domain/types/asset-enums';
import type { StructuralAssetDto } from '../../dtos/assets/structural-asset.dto';
import { mapStructuralAssetToDto } from '../shared/asset-dto.mapper';

@Injectable()
export class GetGridSegmentsUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(
    locale: string,
    clusterSlug: string,
  ): Promise<StructuralAssetDto> {
    // 1) Cluster holen
    const cluster = await this.assetRepo.findStructuralBySlug(
      locale,
      clusterSlug,
    );

    if (!cluster) {
      throw new NotFoundException(
        `Cluster with slug '${clusterSlug}' not found`,
      );
    }

    // 2) ClusterView finden (wir überspringen bewusst nur 1 Ebene)
    const firstLevelChildren = await this.assetRepo.findChildren(
      locale,
      cluster.id,
    );

    const clusterView = firstLevelChildren.find(
      (child) =>
        child instanceof StructuralAsset &&
        child.type === AssetType.CLUSTER_VIEW,
    );

    if (!clusterView) {
      throw new NotFoundException(
        `ClusterView for Cluster '${clusterSlug}' not found`,
      );
    }

    // 3) Segmente aus dem ClusterView holen
    const viewChildren = await this.assetRepo.findChildren(
      locale,
      clusterView.id,
    );

    const segments = viewChildren.filter(
      (child): child is StructuralAsset =>
        child instanceof StructuralAsset && child.type === AssetType.SEGMENT,
    );
    cluster.childrenCount = segments.length;

    // 4) Inhalte der Segmente laden
    for (const segment of segments) {
      const contents = await this.assetRepo.findChildren(locale, segment.id);

      segment.children = contents.filter((c) =>
        [
          AssetType.CONCEPT,
          AssetType.METHOD,
          AssetType.TOOL,
          AssetType.TECHNOLOGY,
        ].includes((c as StructuralAsset).type as AssetType),
      );
      segment.childrenCount = segment.children.length;
    }

    // 5) Ergebnisstruktur zurückgeben: cluster -> segments -> content
    cluster.children = segments;
    return mapStructuralAssetToDto(cluster);
  }
}
