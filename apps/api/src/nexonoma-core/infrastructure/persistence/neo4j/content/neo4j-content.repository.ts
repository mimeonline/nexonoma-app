import { Injectable } from '@nestjs/common';
import {
  getI18nProjectionParam,
  type I18nField,
} from '../../../../../shared/infrastructure/neo4j/cypher-fragments';
import { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import { normalizeNeo4j } from 'src/shared/infrastructure/neo4j/no4j.utils';
import { AssetType } from '../../../../domain/types/asset-enums';
import { ContentRepositoryPort } from '../../../../application/ports/content/content-repository.port';
import {
  ContentRecordMapper,
  type ContentRecord,
  type ContentRelationRecord,
  type ContentStructurePathRecord,
  type ContentAssetBlockRecord,
} from './content-record.mapper';

@Injectable()
export class Neo4jContentRepository implements ContentRepositoryPort {
  constructor(private readonly neo4j: Neo4jService) {}

  private readonly assetI18nFields: I18nField[] = [
    'name',
    'shortDescription',
    'longDescription',
  ];

  private readonly nameOnlyI18nFields: I18nField[] = ['name'];

  async findByTypeAndSlug(
    locale: string = 'en',
    assetType: AssetType,
    slug: string,
  ): Promise<ContentRecord | null> {
    const assetBlock = await this.fetchAssetBlock(locale, assetType, slug);
    if (!assetBlock) return null;

    const [structurePaths, relations] = await Promise.all([
      this.fetchStructurePaths(locale, assetType, slug),
      this.fetchRelations(locale, assetType, slug),
    ]);

    return {
      assetBlock,
      structurePaths,
      relations,
    };
  }

  private async fetchAssetBlock(
    locale: string,
    assetType: AssetType,
    slug: string,
  ): Promise<ContentAssetBlockRecord | null> {
    const i18n = getI18nProjectionParam('asset', this.assetI18nFields);

    const query = `
      MATCH (asset:AssetBlock)
      WHERE asset.slug = $slug AND asset.type = $type
      RETURN asset {
        .id,
        .slug,
        .type,
        .icon,
        .tags,
        .tagOrder,
        .organizationalLevel,
        .organizationalMaturity,
        .impacts,
        .decisionType,
        .complexityLevel,
        .valueStreamStage,
        .maturityLevel,
        .cognitiveLoad,
        ${i18n}
      } AS assetData
      LIMIT 1
    `;

    const result = await this.neo4j.read(query, {
      slug,
      type: assetType,
      lang: locale,
    });

    if (!result.length) return null;

    const assetData = normalizeNeo4j(result[0].get('assetData'));
    return ContentRecordMapper.toAssetBlockRecord(assetData);
  }

  private async fetchStructurePaths(
    locale: string,
    assetType: AssetType,
    slug: string,
  ): Promise<ContentStructurePathRecord[]> {
    const i18nMacro = getI18nProjectionParam('macro', this.nameOnlyI18nFields);
    const i18nCluster = getI18nProjectionParam(
      'cluster',
      this.nameOnlyI18nFields,
    );
    const i18nSegment = getI18nProjectionParam(
      'segment',
      this.nameOnlyI18nFields,
    );

    const query = `
      MATCH (asset:AssetBlock)
      WHERE asset.slug = $slug AND asset.type = $type
      OPTIONAL MATCH (segment:AssetBlock {type: $segmentType})-[:CONTAINS]->(asset)
      OPTIONAL MATCH (view:AssetBlock {type: $viewType})-[:CONTAINS]->(segment)
      OPTIONAL MATCH (clusterFromView:AssetBlock {type: $clusterType})-[:CONTAINS]->(view)
      OPTIONAL MATCH (clusterDirect:AssetBlock {type: $clusterType})-[:CONTAINS]->(segment)
      WITH segment, coalesce(clusterFromView, clusterDirect) AS cluster
      WHERE segment IS NOT NULL
      OPTIONAL MATCH (macro:AssetBlock {type: $macroType})-[:CONTAINS]->(cluster)
      RETURN DISTINCT
        macro {
          .slug,
          ${i18nMacro}
        } AS macroData,
        cluster {
          .slug,
          ${i18nCluster}
        } AS clusterData,
        segment {
          .slug,
          .tags,
          .tagOrder,
          ${i18nSegment}
        } AS segmentData
      ORDER BY macroData.name ASC, clusterData.name ASC, segmentData.name ASC
    `;

    const result = await this.neo4j.read(query, {
      slug,
      type: assetType,
      lang: locale,
      macroType: AssetType.MACRO_CLUSTER,
      clusterType: AssetType.CLUSTER,
      viewType: AssetType.CLUSTER_VIEW,
      segmentType: AssetType.SEGMENT,
    });

    return result.map((record) => {
      const macroRaw = record.get('macroData');
      const clusterRaw = record.get('clusterData');
      const segmentRaw = record.get('segmentData');

      const macro = macroRaw ? normalizeNeo4j(macroRaw) : null;
      const cluster = clusterRaw ? normalizeNeo4j(clusterRaw) : null;
      const segment = segmentRaw ? normalizeNeo4j(segmentRaw) : null;

      return ContentRecordMapper.toStructurePathRecord(
        macro,
        cluster,
        segment,
      );
    });
  }

  private async fetchRelations(
    locale: string,
    assetType: AssetType,
    slug: string,
  ): Promise<ContentRelationRecord[]> {
    const i18nNeighbor = getI18nProjectionParam(
      'neighbor',
      this.nameOnlyI18nFields,
    );

    const query = `
      MATCH (asset:AssetBlock)
      WHERE asset.slug = $slug AND asset.type = $type
      MATCH (asset)-[rel]-(neighbor:AssetBlock)
      WITH rel, neighbor,
        neighbor {
          .id,
          .type,
          .slug,
          .icon,
          ${i18nNeighbor}
        } AS nodeData
      RETURN {
        id: toString(coalesce(rel.id, id(rel))),
        type: coalesce(rel.type, type(rel)),
        relation: coalesce(rel.relation, type(rel)),
        node: nodeData
      } AS relationData
      ORDER BY nodeData.name ASC, nodeData.slug ASC
      LIMIT toInteger($limit)
    `;

    const result = await this.neo4j.read(query, {
      slug,
      type: assetType,
      lang: locale,
      limit: 30,
    });

    return result.map((record) => {
      const relationData = normalizeNeo4j(record.get('relationData'));
      return ContentRecordMapper.toRelationRecord(relationData);
    });
  }
}
