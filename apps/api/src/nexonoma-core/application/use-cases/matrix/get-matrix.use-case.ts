import { Injectable } from '@nestjs/common';
import {
  MatrixCellRecord,
  MatrixRepositoryPort,
} from '../../ports/matrix/matrix-repository.port';
import type { MatrixResponseDto } from '../../dtos/matrix/matrix-response.dto';
import { GetMatrixQuery } from './get-matrix.query';
import {
  DECISION_TYPE_BUCKETS,
  MatrixMode,
  MatrixPerspective,
  ORGANIZATIONAL_MATURITY_BUCKETS,
  VALUE_STREAM_BUCKETS,
} from './matrix.types';
import { LocalizationHelper } from '../../../../shared/common/utils/localization.helper';

@Injectable()
export class GetMatrixUseCase {
  constructor(private readonly matrixRepo: MatrixRepositoryPort) {}

  async execute(query: GetMatrixQuery): Promise<MatrixResponseDto> {
    const { clusterId, mode, lang, contentTypes, cellLimit } = query;
    const scope = await this.matrixRepo.findClusterScope(lang, clusterId);

    if (mode === MatrixMode.SEGMENT_BY_SEGMENT) {
      const yScope = await this.matrixRepo.findClusterScope(
        lang,
        query.yClusterId,
      );
      const xSegments = await this.matrixRepo.findSegmentsByCluster(
        lang,
        clusterId,
      );
      const ySegments = await this.matrixRepo.findSegmentsByCluster(
        lang,
        query.yClusterId,
      );

      const filteredXSegments = xSegments.filter(
        (segment) => segment.type !== 'CLUSTER_VIEW',
      );
      const filteredYSegments = ySegments.filter(
        (segment) => segment.type !== 'CLUSTER_VIEW',
      );

      const cells = await this.matrixRepo.findSegmentSegmentCells({
        xClusterId: clusterId,
        yClusterId: query.yClusterId,
        contentTypes,
        cellLimit,
        lang,
      });

      const mappedCells = this.mapCells(cells, cellLimit, lang);

      return {
        meta: {
          clusterId,
          mode,
          perspective: query.perspective ?? MatrixPerspective.VALUE_STREAM,
          lang,
          contentTypes,
          cellLimit,
          generatedAt: new Date().toISOString(),
          scope: {
            ...(scope ?? {}),
            yMacroCluster: yScope?.macroCluster,
            yCluster: yScope?.cluster,
            xAxisKey: 'SEGMENT',
            yAxisKey: 'SEGMENT',
          },
        },
        axes: {
          x: {
            type: 'STRUCTURE',
            key: 'SEGMENT',
            label: 'Segment',
            items: filteredXSegments.map((segment) => ({
              id: segment.id,
              label: segment.name,
            })),
          },
          y: {
            type: 'STRUCTURE',
            key: 'SEGMENT',
            label: 'Segment',
            items: filteredYSegments.map((segment) => ({
              id: segment.id,
              label: segment.name,
            })),
          },
        },
        cells: mappedCells,
        stats: this.buildStats(mappedCells),
      };
    }

    const { perspective } = query;
    const yItems = this.getPerspectiveBuckets(perspective).map((bucket) => ({
      id: bucket,
      label: bucket,
    }));

    if (mode === MatrixMode.SEGMENT_BY_PERSPECTIVE) {
      const segments = await this.matrixRepo.findSegmentsByCluster(
        lang,
        clusterId,
      );

      const filteredSegments = segments.filter(
        (segment) => segment.type !== 'CLUSTER_VIEW',
      );

      const cells = await this.matrixRepo.findSegmentPerspectiveCells({
        clusterId,
        perspective,
        contentTypes,
        cellLimit,
        lang,
      });

      const mappedCells = this.mapCells(cells, cellLimit, lang);

      return {
        meta: {
          clusterId,
          mode,
          perspective,
          lang,
          contentTypes,
          cellLimit,
          generatedAt: new Date().toISOString(),
          scope: scope
            ? {
                ...scope,
                xAxisKey: 'SEGMENT',
                yAxisKey: perspective,
              }
            : {
                xAxisKey: 'SEGMENT',
                yAxisKey: perspective,
              },
        },
        axes: {
          x: {
            type: 'STRUCTURE',
            key: 'SEGMENT',
            label: 'Segment',
            items: filteredSegments.map((segment) => ({
              id: segment.id,
              label: segment.name,
            })),
          },
          y: {
            type: 'PERSPECTIVE',
            key: perspective,
            label: this.getPerspectiveLabel(perspective),
            items: yItems,
          },
        },
        cells: mappedCells,
        stats: this.buildStats(mappedCells),
      };
    }

    const roleIds = query.xIds ?? [];
    const roles = await this.matrixRepo.findRolesByIds(lang, roleIds);
    const roleLabelMap = new Map(roles.map((role) => [role.id, role.name]));

    const cells = await this.matrixRepo.findRolePerspectiveCells({
      clusterId,
      perspective,
      contentTypes,
      cellLimit,
      lang,
      roleIds,
    });

    const mappedCells = this.mapCells(cells, cellLimit, lang);

    return {
      meta: {
        clusterId,
        mode,
        perspective,
        lang,
        contentTypes,
        cellLimit,
        generatedAt: new Date().toISOString(),
        scope: scope
          ? {
              ...scope,
              xAxisKey: 'ROLE',
              yAxisKey: perspective,
            }
          : {
              xAxisKey: 'ROLE',
              yAxisKey: perspective,
            },
      },
      axes: {
        x: {
          type: 'CONTEXT',
          key: 'ROLE',
          label: 'Role',
          items: roleIds.map((id) => ({
            id,
            label: roleLabelMap.get(id) ?? id,
          })),
        },
        y: {
          type: 'PERSPECTIVE',
          key: perspective,
          label: this.getPerspectiveLabel(perspective),
          items: yItems,
        },
      },
      cells: mappedCells,
      stats: this.buildStats(mappedCells),
    };
  }

  private mapCells(cells: MatrixCellRecord[], cellLimit: number, lang: string) {
    return cells.map((cell) => ({
      xId: cell.xId,
      yId: cell.yId,
      count: cell.count,
      hasMore: cell.count > (cell.items?.length ?? 0),
      items: (cell.items ?? []).map((item) => ({
        id: item.id,
        type: item.type,
        slug: item.slug,
        name: item.name,
        shortDescription: item.shortDescription,
        tags: this.toLocalizedTags(item.tags, lang),
        valueStreamStage: item.valueStreamStage,
        decisionType: item.decisionType,
        organizationalMaturity: item.organizationalMaturity,
      })),
    }));
  }

  private toLocalizedTags(
    tags: MatrixCellRecord['items'][number]['tags'],
    lang: string,
  ) {
    if (!tags) return undefined;
    const localized = LocalizationHelper.localizeTags(tags as any, lang);
    return localized.length > 0 ? localized : undefined;
  }

  private buildStats(cells: { count: number }[]) {
    const nonEmptyCells = cells.filter((cell) => cell.count > 0).length;
    const totalItems = cells.reduce((sum, cell) => sum + cell.count, 0);
    return { nonEmptyCells, totalItems };
  }

  private getPerspectiveBuckets(perspective: MatrixPerspective): string[] {
    if (perspective === MatrixPerspective.DECISION_TYPE) {
      return DECISION_TYPE_BUCKETS;
    }
    if (perspective === MatrixPerspective.ORGANIZATIONAL_MATURITY) {
      return ORGANIZATIONAL_MATURITY_BUCKETS;
    }
    return VALUE_STREAM_BUCKETS;
  }

  private getPerspectiveLabel(perspective: MatrixPerspective): string {
    if (perspective === MatrixPerspective.DECISION_TYPE) return 'Decision Type';
    if (perspective === MatrixPerspective.ORGANIZATIONAL_MATURITY) {
      return 'Organizational Maturity';
    }
    return 'Value Stream';
  }
}
