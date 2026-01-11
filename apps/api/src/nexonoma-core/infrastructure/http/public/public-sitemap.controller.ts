import { Controller, Get, Query } from '@nestjs/common';
import { GetAllContentUseCase } from '../../../application/use-cases/catalog/get-all-content.use-case';
import { AssetStatus } from '../../../domain/types/asset-enums';
import type { ContentAsset } from '../../../domain/entities/content-asset.entity';

const DEFAULT_LANGS = ['de', 'en'] as const;
const DEFAULT_LIMIT = 1000;
const MAX_LIMIT = 5000;

type SitemapNodeDto = {
  id: string;
  type: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  availableLanguages: string[];
  tags?: { slug: string; label: string }[];
  tagOrder?: string[];
};

const toIso = (value?: Date | string | null) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const parseLangs = (value?: string) => {
  if (!value) return [...DEFAULT_LANGS];
  const parsed = value
    .split(',')
    .map((lang) => lang.trim())
    .filter((lang) => lang.length > 0);
  return parsed.length > 0 ? parsed : [...DEFAULT_LANGS];
};

@Controller('public/sitemap')
export class PublicSitemapController {
  constructor(private readonly getAll: GetAllContentUseCase) {}

  @Get('nodes')
  async getNodes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('langs') langs?: string,
    @Query('includeReview') includeReview?: string
  ): Promise<SitemapNodeDto[]> {
    const parsedPage = Math.max(1, parseNumber(page, 1));
    const parsedLimit = Math.min(MAX_LIMIT, parseNumber(limit, DEFAULT_LIMIT));
    const includeReviewFlag = includeReview === 'true';
    const languageList = parseLangs(langs);

    const results = await Promise.all(languageList.map((lang) => this.getAll.execute(lang)));

    const merged = new Map<string, { entry: SitemapNodeDto; locales: Set<string> }>();

    results.forEach((assets, index) => {
      const lang = languageList[index];
      assets.forEach((asset: ContentAsset) => {
        const isPublished = asset.status === AssetStatus.PUBLISHED;
        const isReview = includeReviewFlag && asset.status === AssetStatus.REVIEW;
        if (!isPublished && !isReview) return;

        if (!asset.slug || !asset.type) return;

        const key = `${asset.type}::${asset.slug}::${asset.id}`;
        const updatedAt = toIso(asset.updatedAt);
        const createdAt = toIso(asset.createdAt);
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
              tags: asset.tags,
              tagOrder: asset.tagOrder,
            },
            locales: new Set([lang]),
          });
          return;
        }

        existing.locales.add(lang);
        if (updatedAt && (!existing.entry.updatedAt || new Date(updatedAt) > new Date(existing.entry.updatedAt))) {
          existing.entry.updatedAt = updatedAt;
        }
        if (createdAt && (!existing.entry.createdAt || new Date(createdAt) > new Date(existing.entry.createdAt))) {
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
        return a.availableLanguages.join(',').localeCompare(b.availableLanguages.join(','));
      });

    const start = (parsedPage - 1) * parsedLimit;
    const end = start + parsedLimit;
    return allEntries.slice(start, end);
  }
}
