import type { ContentRecord } from '../../../infrastructure/persistence/neo4j/content/content-record.mapper';
import { TagsRehydrator } from '../../../infrastructure/persistence/neo4j/shared/tags.rehydrator';
import type { LocalizedTagDto } from '../../dtos/assets/localized-tag.dto';
import type {
  ContentAssetBlockDto,
  ContentRelationItemDto,
  ContentResponseDto,
  ContentStructurePathDto,
} from '../../dtos/content/content-response.dto';

const toLocalizedTags = (
  value: unknown,
  locale: string,
): LocalizedTagDto[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    const hasStringLabel = value.some(
      (tag) => tag && typeof (tag as { label?: unknown }).label === 'string',
    );
    if (hasStringLabel) return value as LocalizedTagDto[];
  }

  const tagMap = TagsRehydrator.toTagMap(value);
  return (TagsRehydrator.localize(tagMap, locale) ?? []) as LocalizedTagDto[];
};

const buildTagOrder = (
  tagOrder: string[] | undefined,
  tags: LocalizedTagDto[],
): string[] => {
  if (tagOrder && tagOrder.length > 0) return tagOrder;

  const slugs = tags
    .map((tag) => tag.slug)
    .filter((slug): slug is string => typeof slug === 'string');

  return Array.from(new Set(slugs)).sort((a, b) => a.localeCompare(b));
};

const toOrganizationLevel = (
  value: ContentRecord['assetBlock']['organizationalLevel'],
): string | null => {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === 'string') return value;
  return null;
};

const toContentAssetBlockDto = (
  record: ContentRecord['assetBlock'],
  locale: string,
): ContentAssetBlockDto => {
  const tags = toLocalizedTags(record.tags, locale);
  const tagOrder = buildTagOrder(record.tagOrder, tags);

  return {
    id: record.id,
    slug: record.slug,
    type: record.type,
    name: record.name ?? record.slug,
    icon: record.icon ?? null,
    tags,
    tagOrder,
    shortDescription: record.shortDescription ?? '',
    longDescription: record.longDescription ?? '',
    organisationLevel: toOrganizationLevel(record.organizationalLevel),
    organizationalMaturity: record.organizationalMaturity ?? null,
    impacts: record.impacts ?? null,
    decisionType: record.decisionType ?? null,
    complexityLevel: record.complexityLevel ?? null,
    valueStream: record.valueStreamStage ?? null,
    maturityLevel: record.maturityLevel ?? null,
    cognitiveLoad: record.cognitiveLoad ?? null,
  };
};

const toStructurePathDtos = (
  paths: ContentRecord['structurePaths'],
  locale: string,
): ContentStructurePathDto[] => {
  const mapped = paths
    .map((path) => {
      if (!path.segment || !path.cluster || !path.macroCluster) return null;

      const segmentTags = toLocalizedTags(path.segment.tags, locale);
      const segmentTagOrder = buildTagOrder(
        path.segment.tagOrder,
        segmentTags,
      );

      return {
        macroCluster: {
          name: path.macroCluster.name ?? path.macroCluster.slug ?? '',
          slug: path.macroCluster.slug ?? '',
        },
        cluster: {
          name: path.cluster.name ?? path.cluster.slug ?? '',
          slug: path.cluster.slug ?? '',
        },
        segment: {
          name: path.segment.name ?? path.segment.slug ?? '',
          slug: path.segment.slug ?? '',
          tags: segmentTags,
          tagOrder: segmentTagOrder,
        },
      } as ContentStructurePathDto;
    })
    .filter((path): path is ContentStructurePathDto => Boolean(path));

  const unique = new Map<string, ContentStructurePathDto>();
  mapped.forEach((path) => {
    const key = `${path.macroCluster.slug}::${path.cluster.slug}::${path.segment.slug}`;
    if (!unique.has(key)) unique.set(key, path);
  });

  return Array.from(unique.values());
};

const toRelationDtos = (
  relations: ContentRecord['relations'],
): ContentRelationItemDto[] => {
  return relations
    .filter((relation) => relation.node?.id)
    .map((relation) => ({
      id: relation.id,
      type: relation.type ?? null,
      relation: relation.relation ?? null,
      node: {
        id: relation.node.id,
        type: relation.node.type,
        slug: relation.node.slug,
        name: relation.node.name ?? relation.node.slug,
        icon: relation.node.icon ?? null,
      },
    }));
};

export class ContentDtoBuilder {
  static build(record: ContentRecord, locale: string): ContentResponseDto {
    return {
      assetBlock: toContentAssetBlockDto(record.assetBlock, locale),
      structure: {
        paths: toStructurePathDtos(record.structurePaths, locale),
      },
      relations: {
        items: toRelationDtos(record.relations),
      },
    };
  }
}
