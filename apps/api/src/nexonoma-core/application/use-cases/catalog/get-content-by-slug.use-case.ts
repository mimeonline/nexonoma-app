import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';
import type { ContentAssetDto } from '../../dtos/assets/content-asset.dto';
import { mapContentAssetToDto } from '../shared/asset-dto.mapper';

@Injectable()
export class GetContentBySlugUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  /**
   * Sucht einen Content-Baustein anhand seines Typs und Slugs.
   * Z.B. type="tool", slug="nestjs"
   */
  async execute(
    locale: string,
    type: string,
    slug: string,
  ): Promise<ContentAssetDto> {
    const asset = await this.assetRepo.findContentBySlug(
      locale,
      type.toUpperCase(),
      slug,
    );

    if (!asset) {
      throw new NotFoundException(
        `Content asset with type '${type.toUpperCase()}' and slug '${slug}' not found`,
      );
    }

    return mapContentAssetToDto(asset);
  }
}
