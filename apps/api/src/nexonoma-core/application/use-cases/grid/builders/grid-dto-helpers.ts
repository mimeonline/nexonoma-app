import type { GridNodeRecord } from '../../../../infrastructure/persistence/neo4j/grid/grid-record.mapper';
import { TagsRehydrator } from '../../../../infrastructure/persistence/neo4j/shared/tags.rehydrator';
import type { LocalizedTagDto } from '../../../dtos/assets/localized-tag.dto';
import type { GridOverviewItemDto } from '../../../dtos/grid/grid-overview-item.dto';

const toLocalizedTags = (value: GridNodeRecord['tags'], locale: string) => {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    const hasStringLabel = value.some(
      (tag) => tag && typeof (tag as { label?: unknown }).label === 'string',
    );
    if (hasStringLabel) return value as LocalizedTagDto[];
  }

  const tagMap = TagsRehydrator.toTagMap(value);
  return TagsRehydrator.localize(tagMap, locale) as LocalizedTagDto[] | undefined;
};

export const buildOverviewItem = (
  record: GridNodeRecord,
  locale: string,
): GridOverviewItemDto => {
  if (!record.id) {
    throw new Error(
      `GridNodeRecord is missing "id" for slug="${record.slug}". Ensure your Cypher projects .id.`,
    );
  }

  return {
    id: record.id,
    type: record.type,
    slug: record.slug,
    name: record.name ?? record.slug,
    shortDescription: record.shortDescription,
    longDescription: record.longDescription,
    icon: record.icon,
    tags: toLocalizedTags(record.tags, locale),
    tagOrder: record.tagOrder,
    framework: record.framework,
    parentId: record.parentId,
    childrenCount: record.childrenCount,
  };
};
