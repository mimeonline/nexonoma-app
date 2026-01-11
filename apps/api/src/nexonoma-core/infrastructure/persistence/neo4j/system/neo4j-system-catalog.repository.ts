import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import type { CatalogIndexRecord } from '../../../../domain/entities/catalog-index-record.entity';
import { AssetType } from '../../../../domain/types/asset-enums';
import { SystemCatalogRepositoryPort } from '../../../../application/ports/system/system-catalog-repository.port';
import { normalizeNeo4j } from 'src/shared/infrastructure/neo4j/no4j.utils';

@Injectable()
export class Neo4jSystemCatalogRepository implements SystemCatalogRepositoryPort {
  constructor(private readonly neo4j: Neo4jService) {}

  async findContentIndex(locale: string = 'en'): Promise<CatalogIndexRecord[]> {
    const query = `
      MATCH (n:AssetBlock)
      WHERE n.type IN [$t1, $t2, $t3, $t4]
        AND n['name_' + $lang] IS NOT NULL
        AND n['name_' + $lang] <> ''
      RETURN n {
        .id,
        .type,
        .slug,
        .status,
        .createdAt,
        .updatedAt,
        .tags,
        .tagOrder
      } AS assetData
      ORDER BY assetData.type ASC, assetData.slug ASC, assetData.id ASC
    `;

    const params = {
      lang: locale,
      t1: AssetType.TOOL,
      t2: AssetType.METHOD,
      t3: AssetType.CONCEPT,
      t4: AssetType.TECHNOLOGY,
    };

    const result = await this.neo4j.read(query, params);

    return result.map((record) => {
      const rawAssetData = record.get('assetData');
      const normalized = normalizeNeo4j(rawAssetData);

      return {
        id: normalized.id,
        type: normalized.type,
        slug: normalized.slug,
        status: normalized.status,
        createdAt: normalized.createdAt,
        updatedAt: normalized.updatedAt,
        language: locale,
        tags: normalized.tags,
        tagOrder: normalized.tagOrder,
      };
    });
  }
}
