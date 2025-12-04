import { Injectable, NotFoundException } from '@nestjs/common';
import { MacroClusterItemDto } from '../dto/macro-cluster.response.dto';
import { MacroClusterRepositoryPort } from '../ports/macro-cluster.repository.port';

@Injectable()
export class GetMacroClusterByIdUseCase {
  constructor(
    private readonly macroClusterRepository: MacroClusterRepositoryPort,
  ) {}

  async execute(id: string): Promise<MacroClusterItemDto> {
    const entity = await this.macroClusterRepository.loadMacroClusterById(id);

    if (!entity) {
      throw new NotFoundException('MacroCluster not found');
    }

    return {
      ...entity.toPlain(),
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      type: entity.type,
      shortDescription: entity.shortDescription,
      longDescription: entity.longDescription,
    };
  }
}
