import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import { CatalogRepositoryPort } from '../../../../application/ports/catalog/catalog-repository.port';
import { ContentAsset } from '../../../../domain/entities/content-asset.entity';
import { AssetType } from '../../../../domain/types/asset-enums';
import { AssetMapper } from '../shared/asset.mapper';
import { getI18nProjection } from '../../../../../shared/infrastructure/neo4j/cypher-fragments';

@Injectable()
export class Neo4jCatalogRepository implements CatalogRepositoryPort {
  constructor(private readonly neo4j: Neo4jService) {}

  /**
   * Page 4: Katalog Liste (Alle Content Types)
   */
  async findAllContent(locale: string = 'en'): Promise<ContentAsset[]> {
    const i18n = getI18nProjection('n');

    const query = `
      MATCH (n:AssetBlock)
      WHERE n.type IN [$t1, $t2, $t3, $t4]
      RETURN n {
        .*,
        ${i18n}
      } AS assetData
      ORDER BY assetData.name ASC
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
      const assetData = record.get('assetData');
      return AssetMapper.toDomain(assetData, locale) as ContentAsset;
    });
  }
}
