import { Injectable } from '@nestjs/common';
import { StructuralAsset } from '../../../domain/entities/structural-asset.entity';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';

@Injectable()
export class GetGridMacrosUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(lang: string): Promise<StructuralAsset[]> {
    // Ruft einfach alle MacroCluster aus dem Repo ab.
    // Hier könnte später Caching passieren.
    return this.assetRepo.findMacroClusters(lang);
  }
}
