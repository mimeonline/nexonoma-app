import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '../../../shared/infrastructure/neo4j/neo4j.service';
import { AssetBlock } from '../../domain/entities/asset.entity';
import { ContentAsset } from '../../domain/entities/content-asset.entity';
import { ContextAsset } from '../../domain/entities/context-asset.entity';
import { StructuralAsset } from '../../domain/entities/structural-asset.entity';
import { AssetRepositoryPort } from '../../domain/ports/outbound/asset-repository.port';
import { AssetType } from '../../domain/types/asset-enums';
import { AssetMapper } from './asset.mapper';
// Importiere deinen Helper (Pfad ggf. anpassen)
import { getI18nProjection } from '../../../shared/infrastructure/neo4j/cypher-fragments';

@Injectable()
export class Neo4jAssetRepository implements AssetRepositoryPort {
  private readonly logger = new Logger(Neo4jAssetRepository.name);

  constructor(private readonly neo4j: Neo4jService) {}

  /**
   * Page 1: Holt alle MacroClusters
   */
  async findMacroClusters(locale: string = 'en'): Promise<StructuralAsset[]> {
    const i18n = getI18nProjection('n');

    // Wir nutzen Map Projection: n { .*, name: ... }
    // Das holt alle Properties UND überschreibt die i18n Felder mit der gewählten Sprache
    const query = `
      MATCH (n:AssetBlock)
      WHERE n.type = $type
      RETURN n {
        .*,
        ${i18n}
      } AS assetData
      ORDER BY assetData.name ASC
    `;

    const result = await this.neo4j.read(query, {
      type: AssetType.MACRO_CLUSTER,
      lang: locale,
    });

    return result.map((record) => {
      const assetData = record.get('assetData');
      return AssetMapper.toDomain(assetData, locale) as StructuralAsset;
    });
  }

  /**
   * Page 2 & 3: Findet ein Strukturelement (Macro, Cluster, Segment) anhand des Slugs.
   */
  async findStructuralBySlug(
    locale: string = 'en',
    slug: string,
  ): Promise<StructuralAsset | null> {
    const i18n = getI18nProjection('n');

    const query = `
      MATCH (n:AssetBlock)
      WHERE n.slug = $slug AND n.type IN [$mc, $c, $s, $cv]
      RETURN n {
        .*,
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

    const assetData = result[0].get('assetData');
    return AssetMapper.toDomain(assetData, locale) as StructuralAsset;
  }

  /**
   * Findet alle Kinder eines Parents.
   */
  async findChildren(
    locale: string = 'en',
    parentId: string,
  ): Promise<AssetBlock[]> {
    // Hier ist der Alias 'c' für Child
    const i18n = getI18nProjection('c');

    const query = `
      MATCH (p:AssetBlock {id: $parentId})
      MATCH (p)-[:CONTAINS|RELATED_TO]->(c:AssetBlock)
      RETURN c {
        .*,
        ${i18n}
      } AS assetData
      ORDER BY assetData.name ASC
    `;

    const result = await this.neo4j.read(query, { parentId, lang: locale });

    return result.map((record) => {
      const assetData = record.get('assetData');
      return AssetMapper.toDomain(assetData, locale);
    });
  }

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

  /**
   * Page 5: Detailansicht (Find by ID)
   */
  async findById(
    locale: string = 'en',
    id: string,
  ): Promise<ContentAsset | ContextAsset | null> {
    const i18n = getI18nProjection('n');

    const query = `
      MATCH (n:AssetBlock {id: $id})
      RETURN n {
        .*,
        ${i18n}
      } AS assetData
    `;

    const result = await this.neo4j.read(query, { id, lang: locale });

    if (result.length === 0) {
      return null;
    }

    const assetData = result[0].get('assetData');
    return AssetMapper.toDomain(assetData, locale) as
      | ContentAsset
      | ContextAsset;
  }

  async findContentBySlug(
    locale: string = 'en',
    type: string,
    slug: string,
  ): Promise<ContentAsset | null> {
    const i18n = getI18nProjection('n');

    const query = `
      MATCH (n:AssetBlock)
      WHERE n.slug = $slug AND n.type = $type
      RETURN n {
        .*,
        ${i18n}
      } AS assetData
    `;

    const result = await this.neo4j.read(query, {
      slug,
      type,
      lang: locale,
    });

    if (result.length === 0) return null;

    const assetData = result[0].get('assetData');
    return AssetMapper.toDomain(assetData, locale) as ContentAsset;
  }
}
