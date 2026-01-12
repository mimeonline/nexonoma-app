import type { GridNodeRecord } from '../../../infrastructure/persistence/neo4j/grid/grid-record.mapper';
import { TagsRehydrator } from '../../../infrastructure/persistence/neo4j/shared/tags.rehydrator';
import type { LocalizedTagDto } from '../../dtos/assets/localized-tag.dto';
import type { GridMacroclustersResponseDto } from '../../dtos/grid/macroclusters-response.dto';
import type { GridNodeDto } from '../../dtos/grid/grid-node.dto';

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

export class GridDtoBuilder {
  static buildMacroclusters(
    records: GridNodeRecord[],
    locale: string,
  ): GridMacroclustersResponseDto[] {
    return records.map((record) => GridDtoBuilder.buildNode(record, locale));
  }

  static buildNode(
    record: GridNodeRecord,
    locale: string,
    children?: GridNodeDto[],
  ): GridNodeDto {
    if (!record.id) {
      throw new Error(
        `GridNodeRecord is missing "id" for slug="${record.slug}". Ensure your Cypher projects .id.`,
      );
    }

    const resolvedChildren = children ?? [];

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
      children: resolvedChildren,
      childrenCount:
        children !== undefined ? resolvedChildren.length : record.childrenCount,
    };
  }
}
