import { Injectable } from '@nestjs/common';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';
import type { ContentAssetDto } from '../../dtos/assets/content-asset.dto';
import { mapContentAssetToDto } from '../shared/asset-dto.mapper';

@Injectable()
export class GetAllContentUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(locale: string): Promise<ContentAssetDto[]> {
    // Ruft alle Content-Bausteine ab.
    // Hier könnte man später Filter-Parameter (z.B. type='tool') durchreichen.
    const assets = await this.assetRepo.findAllContent(locale);
    return assets.map(mapContentAssetToDto);
  }
}
