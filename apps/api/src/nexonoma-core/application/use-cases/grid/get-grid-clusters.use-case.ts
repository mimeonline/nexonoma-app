import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';
import type { StructuralAssetDto } from '../../dtos/assets/structural-asset.dto';
import { mapStructuralAssetToDto } from '../shared/asset-dto.mapper';

// TODO: childrenCount zählt aktuell ClusterViews.
// Da ClusterView im UI noch nicht dargestellt wird,
// wirkt der Count auf der Cluster-Seite irreführend.
// Korrekt, sobald ClusterView-Ebene umgesetzt ist.
@Injectable()
export class GetGridClustersUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(locale: string, macroSlug: string): Promise<StructuralAssetDto> {
    // 1. Hole das MacroCluster selbst (für den Titel/Header der Page)
    const macroCluster = await this.assetRepo.findStructuralBySlug(
      locale,
      macroSlug,
    );

    if (!macroCluster) {
      throw new NotFoundException(
        `MacroCluster with slug '${macroSlug}' not found`,
      );
    }

    // 2. Hole die Kinder (Cluster)
    const clusters = await this.assetRepo.findChildren(locale, macroCluster.id);

    // 3. Wir hängen die Kinder an das Eltern-Objekt
    // Da wir in Typescript sind, müssen wir sicherstellen, dass wir children pushen können
    macroCluster.children = clusters;
    macroCluster.childrenCount = clusters.length;

    return mapStructuralAssetToDto(macroCluster);
  }
}
