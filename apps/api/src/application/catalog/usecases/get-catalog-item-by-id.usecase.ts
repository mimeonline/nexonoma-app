import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogRepositoryPort } from '../ports/catalog.repository.port';
import { CatalogItemDto } from '../dto/catalog.response.dto';

@Injectable()
export class GetCatalogItemByIdUseCase {
  constructor(private readonly catalogRepository: CatalogRepositoryPort) {}

  async execute(id: string): Promise<CatalogItemDto> {
    const entity = await this.catalogRepository.loadCatalogItemById(id);

    if (!entity) {
      throw new NotFoundException('Catalog item not found');
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
