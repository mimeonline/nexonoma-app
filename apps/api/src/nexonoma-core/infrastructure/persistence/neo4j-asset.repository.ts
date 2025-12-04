import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '../../../shared/infrastructure/neo4j/neo4j.service';
import { AssetBlock } from '../../domain/entities/asset.entity';
import { ContentAsset } from '../../domain/entities/content-asset.entity';
import { ContextAsset } from '../../domain/entities/context-asset.entity';
import { StructuralAsset } from '../../domain/entities/structural-asset.entity';
import { AssetRepositoryPort } from '../../domain/ports/outbound/asset-repository.port';
import { AssetType } from '../../domain/types/asset-enums';
import { AssetMapper } from './asset.mapper';

@Injectable()
export class Neo4jAssetRepository implements AssetRepositoryPort {
  private readonly logger = new Logger(Neo4jAssetRepository.name);

  constructor(private readonly neo4j: Neo4jService) {}

  /**
   * Page 1: Holt alle MacroClusters
   * Label: AssetBlock
   */
  async findMacroClusters(): Promise<StructuralAsset[]> {
    const query = `
      MATCH (n:AssetBlock)
      WHERE n.type = $type
      RETURN n
      ORDER BY n.name ASC
    `;

    const result = await this.neo4j.read(query, {
      type: AssetType.MACRO_CLUSTER,
    });

    return result.map((record) => {
      const nodeProps = record.get('n').properties;
      return AssetMapper.toDomain(nodeProps) as StructuralAsset;
    });
  }

  /**
   * Page 2 & 3: Findet ein Strukturelement (Macro, Cluster, Segment) anhand des Slugs.
   */
  async findStructuralBySlug(slug: string): Promise<StructuralAsset | null> {
    const query = `
      MATCH (n:AssetBlock)
      WHERE n.slug = $slug AND n.type IN [$mc, $c, $s, $cv]
      RETURN n
    `;

    const params = {
      slug,
      mc: AssetType.MACRO_CLUSTER,
      c: AssetType.CLUSTER,
      s: AssetType.SEGMENT,
      cv: AssetType.CLUSTER_VIEW,
    };

    const result = await this.neo4j.read(query, params);

    if (result.length === 0) {
      return null;
    }

    const nodeProps = result[0].get('n').properties;
    return AssetMapper.toDomain(nodeProps) as StructuralAsset;
  }

  /**
   * Findet alle Kinder eines Parents.
   * Label: AssetBlock
   * Relationen:
   * - Struktur (Macro -> Cluster -> Segment): nutzt [:CONTAINS]
   * - Inhalt (Segment -> Content): nutzt [:RELATED_TO]
   */
  async findChildren(parentId: string): Promise<AssetBlock[]> {
    const query = `
      MATCH (p:AssetBlock {id: $parentId})
      MATCH (p)-[:CONTAINS|RELATED_TO]->(c:AssetBlock)
      RETURN c
      ORDER BY c.name ASC
    `;

    const result = await this.neo4j.read(query, { parentId });

    return result.map((record) => {
      const nodeProps = record.get('c').properties;
      return AssetMapper.toDomain(nodeProps);
    });
  }

  /**
   * Page 4: Katalog Liste (Alle Content Types)
   */
  async findAllContent(): Promise<ContentAsset[]> {
    const query = `
      MATCH (n:AssetBlock)
      WHERE n.type IN [$t1, $t2, $t3, $t4]
      RETURN n
      ORDER BY n.name ASC
    `;

    const params = {
      t1: AssetType.TOOL,
      t2: AssetType.METHOD,
      t3: AssetType.CONCEPT,
      t4: AssetType.TECHNOLOGY,
    };

    const result = await this.neo4j.read(query, params);

    return result.map((record) => {
      const nodeProps = record.get('n').properties;
      return AssetMapper.toDomain(nodeProps) as ContentAsset;
    });
  }

  /**
   * Page 5: Detailansicht (Find by ID)
   */
  async findById(id: string): Promise<ContentAsset | ContextAsset | null> {
    const query = `
      MATCH (n:AssetBlock {id: $id})
      RETURN n
    `;

    const result = await this.neo4j.read(query, { id });

    if (result.length === 0) {
      return null;
    }

    const nodeProps = result[0].get('n').properties;
    const asset = AssetMapper.toDomain(nodeProps);

    return asset as ContentAsset | ContextAsset;
  }
  async findContentBySlug(
    type: string,
    slug: string,
  ): Promise<ContentAsset | null> {
    const query = `
      MATCH (n:AssetBlock)
      WHERE n.slug = $slug AND n.type = $type
      RETURN n
    `;

    const result = await this.neo4j.read(query, { slug, type });

    if (result.length === 0) return null;

    const nodeProps = result[0].get('n').properties;
    return AssetMapper.toDomain(nodeProps) as ContentAsset;
  }
}
