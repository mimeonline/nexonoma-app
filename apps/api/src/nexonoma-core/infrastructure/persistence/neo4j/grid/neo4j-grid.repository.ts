import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import { AssetType } from '../../../../domain/types/asset-enums';
import { StructuralAsset } from '../../../../domain/entities/structural-asset.entity';
import { GridRepositoryPort } from '../../../../application/ports/grid/grid-repository.port';
import { AssetMapper } from '../shared/asset.mapper';
import { normalizeNeo4j } from 'src/shared/infrastructure/neo4j/no4j.utils';
import { getI18nProjection } from '../../../../../shared/infrastructure/neo4j/cypher-fragments';

@Injectable()
export class Neo4jGridRepository implements GridRepositoryPort {
  private readonly logger = new Logger(Neo4jGridRepository.name);

  constructor(private readonly neo4j: Neo4jService) {}

  /**
   * Page 1: Holt alle MacroClusters
   */
  async findMacroClusters(locale: string = 'en'): Promise<StructuralAsset[]> {
    const i18n = getI18nProjection('n');

    const query = `
      MATCH (n:AssetBlock)
      WHERE n.type = $type
      OPTIONAL MATCH (n)-[:CONTAINS]->(c:AssetBlock)
      WITH n, count(c) AS childrenCount
      RETURN n {
        .*,
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
      const rawAssetData = record.get('assetData');
      const normalizedAssetData = normalizeNeo4j(rawAssetData);

      return AssetMapper.toDomain(
        normalizedAssetData,
        locale,
      ) as StructuralAsset;
    });
  }
}
