export type MatrixMacroCluster = {
  id: string;
  name: string;
  order: number;
};

export type MatrixCluster = {
  id: string;
  macroClusterId: string;
  name: string;
  order: number;
};
export type Role = "Architect" | "Engineer" | "Product";
export type Profile = "Strategy" | "Delivery" | "Quality";
export type Domain = "Platform" | "Product" | "Data";
export type Layer = "Strategy" | "Design" | "Implementation" | "Operations";

export const matrixMacroClusters: MatrixMacroCluster[] = [
  { id: "macro-01", name: "MacroCluster 01", order: 1 },
  { id: "macro-02", name: "MacroCluster 02", order: 2 },
];

export const matrixClusters: MatrixCluster[] = [
  { id: "cluster-01", macroClusterId: "macro-01", name: "Cluster 01", order: 1 },
  { id: "cluster-02", macroClusterId: "macro-01", name: "Cluster 02", order: 2 },
  { id: "cluster-03", macroClusterId: "macro-02", name: "Cluster 03", order: 1 },
  { id: "cluster-04", macroClusterId: "macro-02", name: "Cluster 04", order: 2 },
];
export const roles: Role[] = ["Architect", "Engineer", "Product"];
export const profiles: Profile[] = ["Strategy", "Delivery", "Quality"];
export const domains: Domain[] = ["Platform", "Product", "Data"];
export const layers: Layer[] = ["Strategy", "Design", "Implementation", "Operations"];
