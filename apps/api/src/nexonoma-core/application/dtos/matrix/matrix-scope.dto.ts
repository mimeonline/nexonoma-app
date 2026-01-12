export type MatrixScopeNodeDto = {
  id: string;
  slug?: string;
  name?: string;
};

export type MatrixScopeDto = {
  macroCluster?: MatrixScopeNodeDto;
  cluster?: MatrixScopeNodeDto;
  clusterView?: MatrixScopeNodeDto;
  yMacroCluster?: MatrixScopeNodeDto;
  yCluster?: MatrixScopeNodeDto;
  xAxisKey?: string;
  yAxisKey?: string;
};
