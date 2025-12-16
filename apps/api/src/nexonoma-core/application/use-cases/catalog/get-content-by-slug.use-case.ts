import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentAsset } from '../../../domain/entities/content-asset.entity';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';

@Injectable()
export class GetContentBySlugUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  /**
   * Sucht einen Content-Baustein anhand seines Typs und Slugs.
   * Z.B. type="tool", slug="nestjs"
   */
  async execute(
    lang: string,
    type: string,
    slug: string,
  ): Promise<ContentAsset> {
    const asset = await this.assetRepo.findContentBySlug(
      lang,
      type.toUpperCase(),
      slug,
    );

    if (!asset) {
      throw new NotFoundException(
        `Content asset with type '${type.toUpperCase()}' and slug '${slug}' not found`,
      );
    }

    return asset;
  }
}
