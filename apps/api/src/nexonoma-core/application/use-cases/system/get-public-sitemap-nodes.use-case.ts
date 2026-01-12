import { Injectable } from '@nestjs/common';
import type { PublicSitemapQueryDto } from '../../dtos/system/public-sitemap-query.dto';
import type { SitemapNodeDto } from '../../dtos/system/sitemap-node.dto';
import { AssetStatus } from '../../../domain/types/asset-enums';
import { SystemCatalogRepositoryPort } from '../../ports/system/system-catalog-repository.port';
import { LocalizationHelper } from '../../../../shared/common/utils/localization.helper';

const toIso = (value?: Date | string | null) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

const mapTags = (tags: unknown, lang: string) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    const hasStringLabel = tags.some(
      (tag) => tag && typeof (tag as { label?: unknown }).label === 'string',
    );
    if (hasStringLabel) return tags;
  }
  return LocalizationHelper.localizeTags(tags as any, lang);
};

@Injectable()
export class GetPublicSitemapNodesUseCase {
  constructor(private readonly systemRepo: SystemCatalogRepositoryPort) {}

  async execute(query: PublicSitemapQueryDto): Promise<SitemapNodeDto[]> {
    const { page, limit, languages, includeReview } = query;

    const results = await Promise.all(
      languages.map((lang) => this.systemRepo.findContentIndex(lang)),
    );

    const merged = new Map<
      string,
      { entry: SitemapNodeDto; locales: Set<string> }
    >();

    results.forEach((assets, index) => {
      const lang = languages[index];
      assets.forEach((asset) => {
        const isPublished = asset.status === AssetStatus.PUBLISHED;
        const isReview = includeReview && asset.status === AssetStatus.REVIEW;
        if (!isPublished && !isReview) return;

        if (!asset.slug || !asset.type) return;

        const key = `${asset.type}::${asset.slug}::${asset.id}`;
        const updatedAt = toIso(asset.updatedAt);
        const createdAt = toIso(asset.createdAt);
        const localizedTags = mapTags(asset.tags, lang);
        const existing = merged.get(key);

        if (!existing) {
          merged.set(key, {
            entry: {
              id: asset.id,
              type: asset.type,
              slug: asset.slug,
              updatedAt,
              createdAt,
              availableLanguages: [],
              tags: localizedTags,
              tagOrder: asset.tagOrder,
            },
            locales: new Set([lang]),
          });
          return;
        }

        existing.locales.add(lang);
        if (
          updatedAt &&
          (!existing.entry.updatedAt ||
            new Date(updatedAt) > new Date(existing.entry.updatedAt))
        ) {
          existing.entry.updatedAt = updatedAt;
        }
        if (
          createdAt &&
          (!existing.entry.createdAt ||
            new Date(createdAt) > new Date(existing.entry.createdAt))
        ) {
          existing.entry.createdAt = createdAt;
        }
      });
    });

    const allEntries = Array.from(merged.values())
      .map(({ entry, locales }) => ({
        ...entry,
        availableLanguages: Array.from(locales).sort(),
      }))
      .sort((a, b) => {
        const typeCompare = a.type.localeCompare(b.type);
        if (typeCompare !== 0) return typeCompare;
        const slugCompare = a.slug.localeCompare(b.slug);
        if (slugCompare !== 0) return slugCompare;
        const idCompare = a.id.localeCompare(b.id);
        if (idCompare !== 0) return idCompare;
        return a.availableLanguages
          .join(',')
          .localeCompare(b.availableLanguages.join(','));
      });

    const start = (page - 1) * limit;
    const end = start + limit;
    return allEntries.slice(start, end);
  }
}
