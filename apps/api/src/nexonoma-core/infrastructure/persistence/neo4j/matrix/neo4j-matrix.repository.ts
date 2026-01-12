import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import { normalizeNeo4j } from 'src/shared/infrastructure/neo4j/no4j.utils';
import { getI18nProjection } from '../../../../../shared/infrastructure/neo4j/cypher-fragments';
import { AssetType } from '../../../../domain/types/asset-enums';
import {
  MatrixCellRecord,
  MatrixRepositoryPort,
  MatrixRoleRecord,
  MatrixSegmentRecord,
  MatrixScopeRecord,
  RolePerspectiveQueryParams,
  SegmentPerspectiveQueryParams,
  SegmentSegmentQueryParams,
} from '../../../../application/ports/matrix/matrix-repository.port';
import { MatrixRecordMapper } from './matrix-record.mapper';

@Injectable()
export class Neo4jMatrixRepository implements MatrixRepositoryPort {
  constructor(private readonly neo4j: Neo4jService) {}

  async findSegmentsByCluster(
    locale: string,
    clusterId: string,
  ): Promise<MatrixSegmentRecord[]> {
    const i18n = getI18nProjection('segment');
    const query = `
      MATCH (cluster:AssetBlock {id: $clusterId})
      MATCH (cluster)-[:CONTAINS]->(view:AssetBlock)
      MATCH (view)-[:CONTAINS]->(segment:AssetBlock)
      RETURN segment {
        .id,
        .slug,
        .type,
        ${i18n}
      } AS segmentData
      ORDER BY segmentData.name ASC
    `;

    const result = await this.neo4j.read(query, {
      clusterId,
      lang: locale,
    });

    return result.map((record) => {
      const raw = record.get('segmentData');
      const normalized = normalizeNeo4j(raw);
      return {
        id: normalized.id,
        name: normalized.name,
        slug: normalized.slug,
        type: normalized.type,
      } as MatrixSegmentRecord;
    });
  }

  async findSegmentPerspectiveCells(
    params: SegmentPerspectiveQueryParams,
  ): Promise<MatrixCellRecord[]> {
    const i18n = getI18nProjection('asset');

    const query = `
      MATCH (cluster:AssetBlock {id: $clusterId})
      MATCH (cluster)-[:CONTAINS]->(view:AssetBlock)
      MATCH (view)-[:CONTAINS]->(segment:AssetBlock)
      OPTIONAL MATCH (segment)-[:CONTAINS]->(asset:AssetBlock)
      WHERE asset.type IN $contentTypes
      WITH segment, asset,
        CASE $perspective
          WHEN 'VALUE_STREAM' THEN asset.valueStreamStage
          WHEN 'DECISION_TYPE' THEN asset.decisionType
          WHEN 'ORGANIZATIONAL_MATURITY' THEN asset.organizationalMaturity
        END AS bucket
      WHERE asset IS NOT NULL AND bucket IS NOT NULL
      WITH segment, bucket, collect(asset) AS assets
      RETURN segment.id AS xId,
        bucket AS yId,
        size(assets) AS count,
        [asset IN assets[..$cellLimit] | asset {
          .id,
          .type,
          .slug,
          .shortDescription,
          .tags,
          .valueStreamStage,
          .decisionType,
          .organizationalMaturity,
          ${i18n}
        }] AS items
    `;

    const result = await this.neo4j.read(query, {
      clusterId: params.clusterId,
      contentTypes: params.contentTypes,
      perspective: params.perspective,
      cellLimit: params.cellLimit,
      lang: params.lang,
    });

    const cells = result.map((record) => {
      const items = (record.get('items') ?? []).map((item) =>
        normalizeNeo4j(item),
      );
      return {
        xId: record.get('xId'),
        yId: record.get('yId'),
        count: Number(record.get('count')),
        items,
      } as MatrixCellRecord;
    });

    return MatrixRecordMapper.rehydrateCells(cells);
  }

  async findSegmentSegmentCells(
    params: SegmentSegmentQueryParams,
  ): Promise<MatrixCellRecord[]> {
    const i18n = getI18nProjection('asset');
    const query = `
      MATCH (xCluster:AssetBlock {id: $xClusterId})
      MATCH (xCluster)-[:CONTAINS]->(xView:AssetBlock)
      MATCH (xView)-[:CONTAINS]->(xSegment:AssetBlock)
      WHERE xSegment.type IS NULL OR xSegment.type <> 'CLUSTER_VIEW'
      MATCH (yCluster:AssetBlock {id: $yClusterId})
      MATCH (yCluster)-[:CONTAINS]->(yView:AssetBlock)
      MATCH (yView)-[:CONTAINS]->(ySegment:AssetBlock)
      WHERE ySegment.type IS NULL OR ySegment.type <> 'CLUSTER_VIEW'
      OPTIONAL MATCH (xSegment)-[:CONTAINS]->(asset:AssetBlock)<-[:CONTAINS]-(ySegment)
      WHERE asset.type IN $contentTypes
      WITH xSegment, ySegment, collect(asset) AS assets
      RETURN xSegment.id AS xId,
        ySegment.id AS yId,
        size(assets) AS count,
        [asset IN assets[..$cellLimit] | asset {
          .id,
          .type,
          .slug,
          .shortDescription,
          .tags,
          .valueStreamStage,
          .decisionType,
          .organizationalMaturity,
          ${i18n}
        }] AS items
    `;

    const result = await this.neo4j.read(query, {
      xClusterId: params.xClusterId,
      yClusterId: params.yClusterId,
      contentTypes: params.contentTypes,
      cellLimit: params.cellLimit,
      lang: params.lang,
    });

    const cells = result.map((record) => {
      const items = (record.get('items') ?? []).map((item) =>
        normalizeNeo4j(item),
      );
      return {
        xId: record.get('xId'),
        yId: record.get('yId'),
        count: Number(record.get('count')),
        items,
      } as MatrixCellRecord;
    });

    return MatrixRecordMapper.rehydrateCells(cells);
  }

  async findRolesByIds(
    locale: string,
    roleIds: string[],
  ): Promise<MatrixRoleRecord[]> {
    if (roleIds.length === 0) return [];
    const i18n = getI18nProjection('role');
    const query = `
      MATCH (role:AssetBlock)
      WHERE role.id IN $roleIds AND role.type = $roleType
      RETURN role {
        .id,
        ${i18n}
      } AS roleData
    `;

    const result = await this.neo4j.read(query, {
      roleIds,
      roleType: AssetType.ROLE,
      lang: locale,
    });

    return result.map((record) => {
      const raw = record.get('roleData');
      const normalized = normalizeNeo4j(raw);
      return {
        id: normalized.id,
        name: normalized.name,
      } as MatrixRoleRecord;
    });
  }

  async findRolePerspectiveCells(
    params: RolePerspectiveQueryParams,
  ): Promise<MatrixCellRecord[]> {
    const i18n = getI18nProjection('asset');

    const query = `
      MATCH (cluster:AssetBlock {id: $clusterId})
      MATCH (cluster)-[:CONTAINS]->(view:AssetBlock)
      MATCH (view)-[:CONTAINS]->(segment:AssetBlock)
      MATCH (segment)-[:CONTAINS]->(asset:AssetBlock)
      WHERE asset.type IN $contentTypes
      WITH collect(DISTINCT asset) AS assets
      MATCH (role:AssetBlock)
      WHERE role.id IN $roleIds AND role.type = $roleType
      OPTIONAL MATCH (role)-[:RELEVANT_FOR]->(asset:AssetBlock)
      WHERE asset IN assets
      WITH role, asset,
        CASE $perspective
          WHEN 'VALUE_STREAM' THEN asset.valueStreamStage
          WHEN 'DECISION_TYPE' THEN asset.decisionType
          WHEN 'ORGANIZATIONAL_MATURITY' THEN asset.organizationalMaturity
        END AS bucket
      WHERE asset IS NOT NULL AND bucket IS NOT NULL
      WITH role, bucket, collect(asset) AS assets
      RETURN role.id AS xId,
        bucket AS yId,
        size(assets) AS count,
        [asset IN assets[..$cellLimit] | asset {
          .id,
          .type,
          .slug,
          .shortDescription,
          .tags,
          .valueStreamStage,
          .decisionType,
          .organizationalMaturity,
          ${i18n}
        }] AS items
    `;

    const result = await this.neo4j.read(query, {
      clusterId: params.clusterId,
      contentTypes: params.contentTypes,
      perspective: params.perspective,
      cellLimit: params.cellLimit,
      roleIds: params.roleIds,
      roleType: AssetType.ROLE,
      lang: params.lang,
    });

    const cells = result.map((record) => {
      const items = (record.get('items') ?? []).map((item) =>
        normalizeNeo4j(item),
      );
      return {
        xId: record.get('xId'),
        yId: record.get('yId'),
        count: Number(record.get('count')),
        items,
      } as MatrixCellRecord;
    });

    return MatrixRecordMapper.rehydrateCells(cells);
  }

  async findClusterScope(
    locale: string,
    clusterId: string,
  ): Promise<MatrixScopeRecord | null> {
    const i18nMacro = getI18nProjection('macro');
    const i18nCluster = getI18nProjection('cluster');
    const i18nView = getI18nProjection('view');
    const query = `
      MATCH (cluster:AssetBlock {id: $clusterId})
      OPTIONAL MATCH (macro:AssetBlock)-[:CONTAINS]->(cluster)
      OPTIONAL MATCH (cluster)-[:CONTAINS]->(view:AssetBlock)
      RETURN macro {
        .id,
        .slug,
        ${i18nMacro}
      } AS macroData,
      cluster {
        .id,
        .slug,
        ${i18nCluster}
      } AS clusterData,
      view {
        .id,
        .slug,
        ${i18nView}
      } AS viewData
      LIMIT 1
    `;

    const result = await this.neo4j.read(query, {
      clusterId,
      lang: locale,
    });

    if (!result.length) return null;

    const record = result[0];
    const macroRaw = record.get('macroData');
    const clusterRaw = record.get('clusterData');
    const viewRaw = record.get('viewData');

    const macro = macroRaw ? normalizeNeo4j(macroRaw) : null;
    const cluster = clusterRaw ? normalizeNeo4j(clusterRaw) : null;
    const view = viewRaw ? normalizeNeo4j(viewRaw) : null;

    return {
      macroCluster: macro
        ? {
            id: macro.id,
            slug: macro.slug,
            name: macro.name,
          }
        : undefined,
      cluster: cluster
        ? {
            id: cluster.id,
            slug: cluster.slug,
            name: cluster.name,
          }
        : undefined,
      clusterView: view
        ? {
            id: view.id,
            slug: view.slug,
            name: view.name,
          }
        : undefined,
    };
  }
}
