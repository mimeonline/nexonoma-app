import { Injectable } from '@nestjs/common';
import { SystemCatalogIndexResponseDto } from '../../dtos/system-catalog-index-response.dto';
import { SystemCatalogIndexQueryDto } from '../../dtos/system-catalog-index-query.dto';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';
import { AssetType } from '../../../domain/types/asset-enums';

const toIso = (value?: Date | string | null) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

const hasWhitespace = (value: string) => /\s/.test(value);

const isValidSlug = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes('/')) return false;
  if (hasWhitespace(trimmed)) return false;
  return true;
};

type IndexEntry = {
  id: string;
  type: AssetType;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  availableLanguages: Set<string>;
};

@Injectable()
export class GetSystemCatalogIndexUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(
    query: SystemCatalogIndexQueryDto,
  ): Promise<SystemCatalogIndexResponseDto> {
    const { page, limit, status, types, languages } = query;

    if (types.length === 0 || languages.length === 0) {
      return { page, limit, total: 0, items: [] };
    }

    const results = await Promise.all(
      languages.map((lang) => this.assetRepo.findContentIndex(lang)),
    );

    const merged = new Map<string, IndexEntry>();

    results.forEach((assets, index) => {
      const lang = languages[index];
      assets.forEach((asset) => {
        if (!asset?.id || !asset?.type || !asset?.slug) return;
        if (status && asset.status !== status) return;
        if (!types.includes(asset.type)) return;
        if (!isValidSlug(asset.slug)) return;

        const key = `${asset.type}::${asset.slug}::${asset.id}`;
        const updatedAt = toIso(asset.updatedAt);
        const createdAt = toIso(asset.createdAt);
        const existing = merged.get(key);

        if (!existing) {
          merged.set(key, {
            id: asset.id,
            type: asset.type,
            slug: asset.slug,
            updatedAt,
            createdAt,
            availableLanguages: new Set([lang]),
          });
          return;
        }

        existing.availableLanguages.add(lang);

        if (
          updatedAt &&
          (!existing.updatedAt ||
            new Date(updatedAt) > new Date(existing.updatedAt))
        ) {
          existing.updatedAt = updatedAt;
        }

        if (
          createdAt &&
          (!existing.createdAt ||
            new Date(createdAt) > new Date(existing.createdAt))
        ) {
          existing.createdAt = createdAt;
        }
      });
    });

    const ordered = Array.from(merged.values())
      .map((entry) => ({
        id: entry.id,
        type: entry.type,
        slug: entry.slug,
        updatedAt: entry.updatedAt,
        createdAt: entry.createdAt,
        availableLanguages: Array.from(entry.availableLanguages).sort(),
      }))
      .sort((a, b) => {
        const typeCompare = a.type.localeCompare(b.type);
        if (typeCompare !== 0) return typeCompare;
        const slugCompare = a.slug.localeCompare(b.slug);
        if (slugCompare !== 0) return slugCompare;
        const idCompare = a.id.localeCompare(b.id);
        if (idCompare !== 0) return idCompare;
        return 0;
      });

    const total = ordered.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      page,
      limit,
      total,
      items: ordered.slice(start, end),
    };
  }
}
