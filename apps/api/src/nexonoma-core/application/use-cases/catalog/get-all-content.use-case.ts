import { Injectable } from '@nestjs/common';
import { CatalogRepositoryPort } from '../../ports/catalog/catalog-repository.port';
import type { ContentAssetDto } from '../../dtos/assets/content-asset.dto';
import { mapContentAssetToDto } from '../shared/asset-dto.mapper';

@Injectable()
export class GetAllContentUseCase {
  constructor(private readonly catalogRepo: CatalogRepositoryPort) {}

  async execute(locale: string): Promise<ContentAssetDto[]> {
    // Ruft alle Content-Bausteine ab.
    // Hier könnte man später Filter-Parameter (z.B. type='tool') durchreichen.
    const assets = await this.catalogRepo.findAllContent(locale);
    return assets.map(mapContentAssetToDto);
  }
}
