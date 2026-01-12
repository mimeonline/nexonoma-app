export type MatrixScopeNodeDto = {
  id: string;
  slug?: string;
  name?: string;
};

export type MatrixScopeDto = {
  macroCluster?: MatrixScopeNodeDto;
  cluster?: MatrixScopeNodeDto;
  clusterView?: MatrixScopeNodeDto;
  xAxisKey?: string;
  yAxisKey?: string;
};
