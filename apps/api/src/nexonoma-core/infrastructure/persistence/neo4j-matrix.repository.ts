import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../../shared/infrastructure/neo4j/neo4j.service';
import { normalizeNeo4j } from 'src/shared/infrastructure/neo4j/no4j.utils';
import { getI18nProjection } from '../../../shared/infrastructure/neo4j/cypher-fragments';
import { AssetType } from '../../domain/types/asset-enums';
import {
  MatrixCellRecord,
  MatrixRepositoryPort,
  MatrixRoleRecord,
  MatrixSegmentRecord,
  RolePerspectiveQueryParams,
  SegmentPerspectiveQueryParams,
} from '../../application/ports/matrix-repository.port';

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

    return result.map((record) => {
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

    return result.map((record) => {
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
  }
}
