import { Injectable, NotFoundException } from '@nestjs/common';
import { StructuralAsset } from '../../../domain/entities/structural-asset.entity';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';

@Injectable()
export class GetGridSegmentsUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(clusterSlug: string): Promise<StructuralAsset> {
    // 1. Hole das Cluster
    const cluster = await this.assetRepo.findStructuralBySlug(clusterSlug);

    if (!cluster) {
      throw new NotFoundException(
        `Cluster with slug '${clusterSlug}' not found`,
      );
    }

    // 2. Hole die Segmente (Kinder des Clusters)
    const segments = await this.assetRepo.findChildren(cluster.id);

    // 3. Für jedes Segment holen wir jetzt den Content (Enkel)
    // Das ist performancetechnisch "n+1", aber für Iteration 1 okay.
    // Später lösen wir das mit EINER cleveren Cypher-Query im Repo.
    for (const segment of segments) {
      if (segment instanceof StructuralAsset) {
        const contents = await this.assetRepo.findChildren(segment.id);
        segment.children = contents;
      }
    }

    cluster.children = segments;
    return cluster;
  }
}
