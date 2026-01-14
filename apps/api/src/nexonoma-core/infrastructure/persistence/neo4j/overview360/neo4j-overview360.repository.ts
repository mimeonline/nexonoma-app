import { Injectable } from '@nestjs/common';
import { getI18nProjectionList } from 'src/shared/infrastructure/neo4j/cypher-fragments';
import { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import { AssetType } from '../../../../domain/types/asset-enums';
import { Overview360RepositoryPort } from '../../../../application/ports/overview360/overview360-repository.port';
import {
  Overview360RecordMapper,
  type Overview360Record,
} from './overview360-record.mapper';

@Injectable()
export class Neo4jOverview360Repository implements Overview360RepositoryPort {
  constructor(private readonly neo4j: Neo4jService) {}

  async findOverviewItems(locale: string = 'en'): Promise<Overview360Record[]> {
    const i18n = getI18nProjectionList('asset');

    const query = `
      MATCH (asset:AssetBlock)
      WHERE asset.type IN $contentTypes
        AND coalesce(asset.has360, false) = true
      RETURN asset {
        .id,
        .slug,
        .type,
        .icon,
        .decisionType,
        .cognitiveLoad,
        .abstractionLevel,
        ${i18n}
      } AS assetData
      ORDER BY assetData.name ASC
    `;

    const result = await this.neo4j.read(query, {
      lang: locale,
      contentTypes: [
        AssetType.CONCEPT,
        AssetType.METHOD,
        AssetType.TOOL,
        AssetType.TECHNOLOGY,
      ],
    });

    return result.map((record) => {
      const assetData = record.get('assetData');
      return Overview360RecordMapper.toRecord(assetData);
    });
  }
}
