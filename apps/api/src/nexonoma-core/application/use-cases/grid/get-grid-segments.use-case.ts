import { Injectable, NotFoundException } from '@nestjs/common';
import { StructuralAsset } from '../../../domain/entities/structural-asset.entity';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';
import { AssetType } from '../../../domain/types/asset-enums';

@Injectable()
export class GetGridSegmentsUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(clusterSlug: string): Promise<StructuralAsset> {
    // 1) Cluster holen
    const cluster = await this.assetRepo.findStructuralBySlug(clusterSlug);

    if (!cluster) {
      throw new NotFoundException(
        `Cluster with slug '${clusterSlug}' not found`,
      );
    }

    // 2) ClusterView finden (wir überspringen bewusst nur 1 Ebene)
    const firstLevelChildren = await this.assetRepo.findChildren(cluster.id);

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
    const viewChildren = await this.assetRepo.findChildren(clusterView.id);

    const segments = viewChildren.filter(
      (child): child is StructuralAsset =>
        child instanceof StructuralAsset && child.type === AssetType.SEGMENT,
    );

    // 4) Inhalte der Segmente laden
    for (const segment of segments) {
      const contents = await this.assetRepo.findChildren(segment.id);

      segment.children = contents.filter((c) =>
        [
          AssetType.CONCEPT,
          AssetType.METHOD,
          AssetType.TOOL,
          AssetType.TECHNOLOGY,
        ].includes((c as StructuralAsset).type as AssetType),
      );
    }

    // 5) Ergebnisstruktur zurückgeben: cluster -> segments -> content
    cluster.children = segments;
    return cluster;
  }
}
