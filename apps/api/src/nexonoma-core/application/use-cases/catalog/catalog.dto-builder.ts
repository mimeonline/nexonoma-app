// apps/api/src/nexonoma-core/application/use-cases/catalog/catalog.dto-builder.ts

import type { CatalogRecord } from '../../../infrastructure/persistence/neo4j/catalog/catalog-record.mapper';
import { TagsRehydrator } from '../../../infrastructure/persistence/neo4j/shared/tags.rehydrator';
import type { LocalizedTagDto } from '../../dtos/assets/localized-tag.dto';
import { CatalogResponseDto } from '../../dtos/catalog/catalog-response.dto';

export class CatalogDtoBuilder {
  static buildList(
    records: CatalogRecord[],
    locale: string,
  ): CatalogResponseDto[] {
    return records.map((r) => CatalogDtoBuilder.buildItem(r, locale));
  }

  static buildItem(record: CatalogRecord, locale: string): CatalogResponseDto {
    // If id isn't projected yet in the query, fail loudly in dev rather than silently emitting invalid DTOs.
    // (You can change this to a fallback if you currently don't have ids in the projection.)
    if (!record.id) {
      throw new Error(
        `CatalogRecord is missing "id" for slug="${record.slug}". Ensure your Cypher projects .id.`,
      );
    }

    const localizedTags = TagsRehydrator.localize(record.tagsRaw, locale);

    return {
      id: record.id,
      type: record.type,
      slug: record.slug,
      name: record.name,
      shortDescription: record.shortDescription,
      tags: localizedTags as LocalizedTagDto[] | undefined,
    };
  }
}
