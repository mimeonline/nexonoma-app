import { AssetType } from '../../../domain/types/asset-enums';
import { MatrixPerspective, MatrixTagMap } from '../../use-cases/matrix/matrix.types';

export type MatrixAssetPreviewRecord = {
  id: string;
  type: AssetType;
  slug: string;
  name: string;
  shortDescription?: string;
  tags?: MatrixTagMap | { slug: string; label: string }[];
  valueStreamStage?: string;
  decisionType?: string;
  organizationalMaturity?: string;
};

export type MatrixCellRecord = {
  xId: string;
  yId: string;
  count: number;
  items: MatrixAssetPreviewRecord[];
};

export type MatrixSegmentRecord = {
  id: string;
  name: string;
  slug?: string;
  type?: string;
};

export type MatrixRoleRecord = {
  id: string;
  name?: string;
};

export type SegmentPerspectiveQueryParams = {
  clusterId: string;
  perspective: MatrixPerspective;
  contentTypes: AssetType[];
  cellLimit: number;
  lang: string;
};

export type RolePerspectiveQueryParams = SegmentPerspectiveQueryParams & {
  roleIds: string[];
};

export abstract class MatrixRepositoryPort {
  abstract findSegmentsByCluster(
    locale: string,
    clusterId: string,
  ): Promise<MatrixSegmentRecord[]>;

  abstract findSegmentPerspectiveCells(
    params: SegmentPerspectiveQueryParams,
  ): Promise<MatrixCellRecord[]>;

  abstract findRolesByIds(
    locale: string,
    roleIds: string[],
  ): Promise<MatrixRoleRecord[]>;

  abstract findRolePerspectiveCells(
    params: RolePerspectiveQueryParams,
  ): Promise<MatrixCellRecord[]>;
}
