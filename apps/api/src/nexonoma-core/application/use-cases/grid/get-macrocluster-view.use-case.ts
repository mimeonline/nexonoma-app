import { Injectable, NotFoundException } from '@nestjs/common';
import type { MacroClusterViewResponseDto } from '../../dtos/grid/macrocluster-view-response.dto';
import { GridRepositoryPort } from '../../ports/grid/grid-repository.port';
import { MacroClusterViewDtoBuilder } from './builders/macrocluster-view-dto.builder';

@Injectable()
export class GetMacroClusterViewUseCase {
  constructor(private readonly gridRepo: GridRepositoryPort) {}

  async execute(
    locale: string,
    macroSlug: string,
  ): Promise<MacroClusterViewResponseDto> {
    // 1. Hole das MacroCluster selbst (für den Titel/Header der Page)
    const macroCluster = await this.gridRepo.findStructuralBySlug(
      locale,
      macroSlug,
    );
    if (!macroCluster) {
      throw new NotFoundException(
        `MacroCluster with slug '${macroSlug}' not found`,
      );
    }

    // 2. Hole die Kinder (Cluster)
    if (!macroCluster.id) {
      throw new NotFoundException(
        `MacroCluster with slug '${macroSlug}' is missing id`,
      );
    }

    const clusters = await this.gridRepo.findChildren(locale, macroCluster.id);
    console.log('[DEBUG]', clusters);
    return MacroClusterViewDtoBuilder.build(macroCluster, clusters, locale);
  }
}
