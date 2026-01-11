import { Injectable } from '@nestjs/common';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';
import type { StructuralAssetDto } from '../../dtos/assets/structural-asset.dto';
import { mapStructuralAssetToDto } from '../shared/asset-dto.mapper';

@Injectable()
export class GetGridMacrosUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(locale: string): Promise<StructuralAssetDto[]> {
    // Ruft einfach alle MacroCluster aus dem Repo ab.
    // Hier könnte später Caching passieren.
    const macros = await this.assetRepo.findMacroClusters(locale);
    return macros.map(mapStructuralAssetToDto);
  }
}
