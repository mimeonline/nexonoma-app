import { Injectable } from '@nestjs/common';
import { CatalogResponseDto } from '../dto/catalog.response.dto';
import { CatalogRepositoryPort } from '../ports/catalog.repository.port';

@Injectable()
export class GetCatalogUseCase {
  constructor(private readonly catalogRepository: CatalogRepositoryPort) {}

  async execute(): Promise<CatalogResponseDto> {
    const aggregate = await this.catalogRepository.loadCatalog();
    return new CatalogResponseDto(aggregate);
  }
}
