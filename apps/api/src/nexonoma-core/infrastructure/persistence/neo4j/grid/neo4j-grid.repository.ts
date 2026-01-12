import { Injectable } from '@nestjs/common';
import { normalizeNeo4j } from 'src/shared/infrastructure/neo4j/no4j.utils';
import {
  getI18nProjectionParam,
  type I18nField,
} from '../../../../../shared/infrastructure/neo4j/cypher-fragments';
import { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import { GridRepositoryPort } from '../../../../application/ports/grid/grid-repository.port';
import { AssetType } from '../../../../domain/types/asset-enums';
import { GridRecordMapper, type GridNodeRecord } from './grid-record.mapper';

@Injectable()
export class Neo4jGridRepository implements GridRepositoryPort {
  constructor(private readonly neo4j: Neo4jService) {}

  private readonly listI18nFields: I18nField[] = ['name', 'shortDescription'];
  private readonly detailI18nFields: I18nField[] = [
    'name',
    'shortDescription',
    'longDescription',
  ];

  /**
   * Page 1: Holt alle MacroClusters
   */
  async findMacroClusters(locale: string = 'en'): Promise<GridNodeRecord[]> {
    const i18n = getI18nProjectionParam('n', this.listI18nFields);

    const query = `
      MATCH (n:AssetBlock)
      WHERE n.type = $type
      OPTIONAL MATCH (n)-[:CONTAINS]->(c:AssetBlock)
      WITH n, count(c) AS childrenCount
      RETURN n {
        .id,
        .type,
        .slug,
        .icon,
        .tags,
        .tagOrder,
        ${i18n},
        childrenCount: childrenCount
      } AS assetData
      ORDER BY assetData.name ASC
    `;

    const result = await this.neo4j.read(query, {
      type: AssetType.MACRO_CLUSTER,
      lang: locale,
    });

    return result.map((record) => {
      const normalized = normalizeNeo4j(record.get('assetData'));
      return GridRecordMapper.toRecord(normalized);
    });
  }

  async findStructuralBySlug(
    locale: string = 'en',
    slug: string,
  ): Promise<GridNodeRecord | null> {
    const i18n = getI18nProjectionParam('n', this.detailI18nFields);

    const query = `
      MATCH (n:AssetBlock)
      WHERE n.slug = $slug AND n.type IN [$mc, $c, $s, $cv]
      RETURN n {
        .id,
        .type,
        .slug,
        .icon,
        .tags,
        .tagOrder,
        ${i18n}
      } AS assetData
    `;

    const params = {
      slug,
      lang: locale,
      mc: AssetType.MACRO_CLUSTER,
      c: AssetType.CLUSTER,
      s: AssetType.SEGMENT,
      cv: AssetType.CLUSTER_VIEW,
    };

    const result = await this.neo4j.read(query, params);

    if (result.length === 0) {
      return null;
    }

    const normalized = normalizeNeo4j(result[0].get('assetData'));
    return GridRecordMapper.toRecord(normalized);
  }

  async findChildren(
    locale: string = 'en',
    parentId: string,
  ): Promise<GridNodeRecord[]> {
    const i18n = getI18nProjectionParam('c', this.detailI18nFields);

    const query = `
      MATCH (p:AssetBlock {id: $parentId})
      MATCH (p)-[:CONTAINS|RELATED_TO]->(c:AssetBlock)
      OPTIONAL MATCH (c)-[:CONTAINS]->(gc:AssetBlock)
      WITH c, count(gc) AS childrenCount
      RETURN c {
        .id,
        .type,
        .slug,
        .icon,
        .tags,
        .tagOrder,
        ${i18n},
        childrenCount: childrenCount
      } AS assetData
      ORDER BY assetData.name ASC
    `;

    const result = await this.neo4j.read(query, { parentId, lang: locale });

    return result.map((record) => {
      const normalized = normalizeNeo4j(record.get('assetData'));
      return GridRecordMapper.toRecord(normalized);
    });
  }
}
