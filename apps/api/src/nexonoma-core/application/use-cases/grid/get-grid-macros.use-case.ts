import { Injectable } from '@nestjs/common';
import type { GridMacroclustersResponseDto } from '../../dtos/grid/macroclusters-response.dto';
import { GridRepositoryPort } from '../../ports/grid/grid-repository.port';
import { GridDtoBuilder } from './grid.dto-builder';

@Injectable()
export class GetGridMacrosUseCase {
  constructor(private readonly gridRepo: GridRepositoryPort) {}

  async execute(locale: string): Promise<GridMacroclustersResponseDto[]> {
    // Ruft einfach alle MacroCluster aus dem Repo ab.
    // Hier könnte später Caching passieren.
    const macros = await this.gridRepo.findMacroClusters(locale);
    return GridDtoBuilder.buildMacroclusters(macros, locale);
  }
}
