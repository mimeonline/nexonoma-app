import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentRepositoryPort } from '../../ports/content/content-repository.port';
import type { ContentResponseDto } from '../../dtos/content/content-response.dto';
import { ContentDtoBuilder } from './content.dto-builder';
import { AssetType } from '../../../domain/types/asset-enums';

const CONTENT_TYPES = [
  AssetType.CONCEPT,
  AssetType.METHOD,
  AssetType.TOOL,
  AssetType.TECHNOLOGY,
] as const;
type ContentAssetType = (typeof CONTENT_TYPES)[number];

const toContentAssetType = (value: string): ContentAssetType | null => {
  const upper = value.toUpperCase() as ContentAssetType;
  return CONTENT_TYPES.includes(upper) ? upper : null;
};

@Injectable()
export class GetContentUseCase {
  constructor(private readonly contentRepo: ContentRepositoryPort) {}

  async execute(
    locale: string,
    assetType: string,
    slug: string,
  ): Promise<ContentResponseDto> {
    const normalizedType = toContentAssetType(assetType);

    if (!normalizedType) {
      throw new NotFoundException(
        `Content asset with type '${assetType.toUpperCase()}' and slug '${slug}' not found`,
      );
    }

    const record = await this.contentRepo.findByTypeAndSlug(
      locale,
      normalizedType,
      slug,
    );

    if (!record) {
      throw new NotFoundException(
        `Content asset with type '${normalizedType}' and slug '${slug}' not found`,
      );
    }

    return ContentDtoBuilder.build(record, locale);
  }
}
