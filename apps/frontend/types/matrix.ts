import type { AssetType, LocalizedTag } from "./nexonoma";

export const MatrixMode = {
  SEGMENT_BY_PERSPECTIVE: "SEGMENT_BY_PERSPECTIVE",
  ROLE_BY_PERSPECTIVE: "ROLE_BY_PERSPECTIVE",
} as const;

export type MatrixMode = (typeof MatrixMode)[keyof typeof MatrixMode];

export const MatrixPerspective = {
  VALUE_STREAM: "VALUE_STREAM",
  DECISION_TYPE: "DECISION_TYPE",
  ORGANIZATIONAL_MATURITY: "ORGANIZATIONAL_MATURITY",
} as const;

export type MatrixPerspective = (typeof MatrixPerspective)[keyof typeof MatrixPerspective];

export type MatrixAxisItem = {
  id: string;
  label: string;
};

export type MatrixAxis = {
  type: string;
  key: string;
  label: string;
  items: MatrixAxisItem[];
};

export type MatrixAxes = {
  x: MatrixAxis;
  y: MatrixAxis;
};

export type MatrixAssetPreview = {
  id: string;
  type: AssetType;
  slug: string;
  name: string;
  shortDescription?: string;
  tags?: LocalizedTag[];
  valueStreamStage?: string;
  decisionType?: string;
  organizationalMaturity?: string;
};

export type MatrixCell = {
  xId: string;
  yId: string;
  count: number;
  hasMore: boolean;
  items: MatrixAssetPreview[];
};

export type MatrixMeta = {
  clusterId: string;
  mode: MatrixMode;
  perspective: MatrixPerspective;
  lang: string;
  contentTypes: AssetType[];
  cellLimit: number;
  generatedAt: string;
};

export type MatrixStats = {
  nonEmptyCells: number;
  totalItems: number;
};

export type MatrixViewResponseDto = {
  meta: MatrixMeta;
  axes: MatrixAxes;
  cells: MatrixCell[];
  stats: MatrixStats;
};
