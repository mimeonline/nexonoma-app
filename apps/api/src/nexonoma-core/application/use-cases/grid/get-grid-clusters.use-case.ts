import { Injectable, NotFoundException } from '@nestjs/common';
import { StructuralAsset } from '../../../domain/entities/structural-asset.entity';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';

@Injectable()
export class GetGridClustersUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(locale: string, macroSlug: string): Promise<StructuralAsset> {
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

    return macroCluster;
  }
}
