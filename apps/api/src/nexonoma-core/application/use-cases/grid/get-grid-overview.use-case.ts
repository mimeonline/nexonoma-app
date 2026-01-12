import { Injectable } from '@nestjs/common';
import type { GridOverviewResponseDto } from '../../dtos/grid/grid-overview-response.dto';
import { GridRepositoryPort } from '../../ports/grid/grid-repository.port';
import { GridOverviewDtoBuilder } from './builders/grid-overview-dto.builder';

@Injectable()
export class GetGridOverviewUseCase {
  constructor(private readonly gridRepo: GridRepositoryPort) {}

  async execute(locale: string): Promise<GridOverviewResponseDto> {
    // Ruft einfach alle MacroCluster aus dem Repo ab.
    // Hier könnte später Caching passieren.
    const macroclusters = await this.gridRepo.findMacroClusters(locale);
    return GridOverviewDtoBuilder.build(macroclusters, locale);
  }
}
