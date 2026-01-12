// apps/api/src/nexonoma-core/infrastructure/persistence/neo4j/catalog/catalog-record.mapper.ts

import { AssetType } from 'src/nexonoma-core/domain/types/asset-enums';
import { TagsRehydrator, type TagMap } from '../shared/tags.rehydrator';

export type CatalogRecord = {
  id?: string; // optional in case query doesn't project it yet
  type: AssetType;
  slug: string;
  name: string;
  shortDescription?: string;
  /**
   * Rehydrated TagMap (NOT localized yet).
   * Use use-case builder to localize it into DTO tags: [{slug,label}]
   */
  tagsRaw?: TagMap;
};

type NeoCatalogAssetData = {
  id?: string;
  type: AssetType;
  slug: string;
  name: string;
  shortDescription?: string;
  tags?: unknown;
};

export class CatalogRecordMapper {
  /**
   * Map a single Neo4j projection object ("assetData") into a CatalogRecord.
   * This is persistence-layer responsibility: fix JSON strings, normalize raw shapes.
   */
  static toRecord(assetData: NeoCatalogAssetData): CatalogRecord {
    return {
      id: assetData.id,
      type: assetData.type,
      slug: assetData.slug,
      name: assetData.name,
      shortDescription: assetData.shortDescription,
      tagsRaw: TagsRehydrator.toTagMap(assetData.tags),
    };
  }

  static toRecords(
    rows: Array<{ assetData: NeoCatalogAssetData }>,
  ): CatalogRecord[] {
    return rows.map((row) => CatalogRecordMapper.toRecord(row.assetData));
  }
}
