import { Injectable } from '@nestjs/common';
import { normalizeNeo4j } from 'src/shared/infrastructure/neo4j/no4j.utils';
import { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import { SystemContentRepositoryPort } from '../../../../application/ports/system/system-content-repository.port';
import type { CatalogIndexRecord } from '../../../../domain/entities/catalog-index-record.entity';
import { AssetType } from '../../../../domain/types/asset-enums';

@Injectable()
export class Neo4jSystemIndexRepository implements SystemContentRepositoryPort {
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
