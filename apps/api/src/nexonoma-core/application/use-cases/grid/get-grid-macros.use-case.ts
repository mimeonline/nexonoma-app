import { Injectable } from '@nestjs/common';
import { GridRepositoryPort } from '../../ports/grid/grid-repository.port';
import type { StructuralAssetDto } from '../../dtos/assets/structural-asset.dto';
import { mapStructuralAssetToDto } from '../shared/asset-dto.mapper';

@Injectable()
export class GetGridMacrosUseCase {
  constructor(private readonly gridRepo: GridRepositoryPort) {}

  async execute(locale: string): Promise<StructuralAssetDto[]> {
    // Ruft einfach alle MacroCluster aus dem Repo ab.
    // Hier könnte später Caching passieren.
    const macros = await this.gridRepo.findMacroClusters(locale);
    return macros.map(mapStructuralAssetToDto);
  }
}
