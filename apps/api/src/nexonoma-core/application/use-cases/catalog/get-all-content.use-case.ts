import { Injectable } from '@nestjs/common';

import type { CatalogResponseDto } from '../../dtos/catalog/catalog-response.dto';
import { CatalogRepositoryPort } from '../../ports/catalog/catalog-repository.port';
import { CatalogDtoBuilder } from './catalog.dto-builder';

@Injectable()
export class GetAllContentUseCase {
  constructor(private readonly catalogRepo: CatalogRepositoryPort) {}

  async execute(locale: string): Promise<CatalogResponseDto[]> {
    // Repo liefert CatalogRecords (rehydriert, aber noch nicht lokalisiert)
    const records = await this.catalogRepo.findAllContent(locale);

    // DTO-Assembly passiert hier (UseCase!)
    return CatalogDtoBuilder.buildList(records, locale);
  }
}
