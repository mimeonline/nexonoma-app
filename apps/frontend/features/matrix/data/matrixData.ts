import { AssetType } from "@/types/nexonoma";

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

export type MatrixSegment = {
  id: string;
  clusterId: string;
  name: string;
  order: number;
};

export type ValueStreamStage = "DISCOVERY" | "BUILD" | "RUN" | "ITERATE";
export type SdlcStage = "ANALYZE" | "DESIGN" | "BUILD" | "OPERATE";
export type DecisionType = "DESIGN_DECISION" | "ARCHITECTURAL_DECISION" | "ORGANIZATIONAL_DECISION" | "TECHNOLOGY_DECISION";
export type OrganizationalMaturity = "FOUNDATION" | "INTERMEDIATE" | "ADVANCED";
export type Role = "Architect" | "Engineer" | "Product";
export type Profile = "Strategy" | "Delivery" | "Quality";
export type Domain = "Platform" | "Product" | "Data";
export type Layer = "Strategy" | "Design" | "Implementation" | "Operations";

export type MatrixContent = {
  id: string;
  name: string;
  type: AssetType;
  slug: string;
  segmentIds: string[];
  valueStreamStage: ValueStreamStage;
  sdlcStage: SdlcStage;
  decisionType: DecisionType;
  organizationalMaturity: OrganizationalMaturity;
  role: Role;
  profile: Profile;
  domain: Domain;
  layer: Layer;
};

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

export const matrixSegments: MatrixSegment[] = [
  { id: "segment-01", clusterId: "cluster-01", name: "Segment 01", order: 1 },
  { id: "segment-02", clusterId: "cluster-01", name: "Segment 02", order: 2 },
  { id: "segment-03", clusterId: "cluster-01", name: "Segment 03", order: 3 },
  { id: "segment-04", clusterId: "cluster-02", name: "Segment 04", order: 1 },
  { id: "segment-05", clusterId: "cluster-02", name: "Segment 05", order: 2 },
  { id: "segment-06", clusterId: "cluster-02", name: "Segment 06", order: 3 },
  { id: "segment-07", clusterId: "cluster-03", name: "Segment 07", order: 1 },
  { id: "segment-08", clusterId: "cluster-03", name: "Segment 08", order: 2 },
  { id: "segment-09", clusterId: "cluster-04", name: "Segment 09", order: 1 },
  { id: "segment-10", clusterId: "cluster-04", name: "Segment 10", order: 2 },
];

export const matrixContents: MatrixContent[] = [
  {
    id: "method-01",
    name: "Method 01",
    type: AssetType.METHOD,
    slug: "method-01",
    segmentIds: ["segment-01", "segment-02"],
    valueStreamStage: "DISCOVERY",
    sdlcStage: "ANALYZE",
    decisionType: "DESIGN_DECISION",
    organizationalMaturity: "FOUNDATION",
    role: "Architect",
    profile: "Strategy",
    domain: "Platform",
    layer: "Strategy",
  },
  {
    id: "method-02",
    name: "Method 02",
    type: AssetType.METHOD,
    slug: "method-02",
    segmentIds: ["segment-02", "segment-03"],
    valueStreamStage: "DISCOVERY",
    sdlcStage: "ANALYZE",
    decisionType: "ARCHITECTURAL_DECISION",
    organizationalMaturity: "INTERMEDIATE",
    role: "Engineer",
    profile: "Delivery",
    domain: "Product",
    layer: "Design",
  },
  {
    id: "method-03",
    name: "Method 03",
    type: AssetType.METHOD,
    slug: "method-03",
    segmentIds: ["segment-01", "segment-03"],
    valueStreamStage: "BUILD",
    sdlcStage: "DESIGN",
    decisionType: "DESIGN_DECISION",
    organizationalMaturity: "FOUNDATION",
    role: "Architect",
    profile: "Strategy",
    domain: "Platform",
    layer: "Design",
  },
  {
    id: "method-04",
    name: "Method 04",
    type: AssetType.METHOD,
    slug: "method-04",
    segmentIds: ["segment-02"],
    valueStreamStage: "BUILD",
    sdlcStage: "BUILD",
    decisionType: "TECHNOLOGY_DECISION",
    organizationalMaturity: "INTERMEDIATE",
    role: "Engineer",
    profile: "Delivery",
    domain: "Data",
    layer: "Implementation",
  },
  {
    id: "method-05",
    name: "Method 05",
    type: AssetType.METHOD,
    slug: "method-05",
    segmentIds: ["segment-03"],
    valueStreamStage: "RUN",
    sdlcStage: "OPERATE",
    decisionType: "ARCHITECTURAL_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Engineer",
    profile: "Quality",
    domain: "Platform",
    layer: "Operations",
  },
  {
    id: "method-06",
    name: "Method 06",
    type: AssetType.METHOD,
    slug: "method-06",
    segmentIds: ["segment-01", "segment-02", "segment-03"],
    valueStreamStage: "ITERATE",
    sdlcStage: "OPERATE",
    decisionType: "ORGANIZATIONAL_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Product",
    profile: "Strategy",
    domain: "Product",
    layer: "Strategy",
  },
  {
    id: "method-07",
    name: "Method 07",
    type: AssetType.METHOD,
    slug: "method-07",
    segmentIds: ["segment-04", "segment-05"],
    valueStreamStage: "DISCOVERY",
    sdlcStage: "ANALYZE",
    decisionType: "DESIGN_DECISION",
    organizationalMaturity: "FOUNDATION",
    role: "Product",
    profile: "Delivery",
    domain: "Product",
    layer: "Design",
  },
  {
    id: "method-08",
    name: "Method 08",
    type: AssetType.METHOD,
    slug: "method-08",
    segmentIds: ["segment-05", "segment-06"],
    valueStreamStage: "BUILD",
    sdlcStage: "BUILD",
    decisionType: "TECHNOLOGY_DECISION",
    organizationalMaturity: "INTERMEDIATE",
    role: "Engineer",
    profile: "Delivery",
    domain: "Platform",
    layer: "Implementation",
  },
  {
    id: "method-09",
    name: "Method 09",
    type: AssetType.METHOD,
    slug: "method-09",
    segmentIds: ["segment-04"],
    valueStreamStage: "RUN",
    sdlcStage: "OPERATE",
    decisionType: "ARCHITECTURAL_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Engineer",
    profile: "Quality",
    domain: "Data",
    layer: "Operations",
  },
  {
    id: "method-10",
    name: "Method 10",
    type: AssetType.METHOD,
    slug: "method-10",
    segmentIds: ["segment-06"],
    valueStreamStage: "ITERATE",
    sdlcStage: "OPERATE",
    decisionType: "ORGANIZATIONAL_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Product",
    profile: "Strategy",
    domain: "Platform",
    layer: "Strategy",
  },
  {
    id: "method-11",
    name: "Method 11",
    type: AssetType.METHOD,
    slug: "method-11",
    segmentIds: ["segment-07", "segment-08"],
    valueStreamStage: "DISCOVERY",
    sdlcStage: "ANALYZE",
    decisionType: "DESIGN_DECISION",
    organizationalMaturity: "FOUNDATION",
    role: "Architect",
    profile: "Strategy",
    domain: "Product",
    layer: "Design",
  },
  {
    id: "method-12",
    name: "Method 12",
    type: AssetType.METHOD,
    slug: "method-12",
    segmentIds: ["segment-07"],
    valueStreamStage: "BUILD",
    sdlcStage: "DESIGN",
    decisionType: "ARCHITECTURAL_DECISION",
    organizationalMaturity: "INTERMEDIATE",
    role: "Architect",
    profile: "Delivery",
    domain: "Platform",
    layer: "Design",
  },
  {
    id: "method-13",
    name: "Method 13",
    type: AssetType.METHOD,
    slug: "method-13",
    segmentIds: ["segment-08"],
    valueStreamStage: "RUN",
    sdlcStage: "OPERATE",
    decisionType: "TECHNOLOGY_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Engineer",
    profile: "Quality",
    domain: "Data",
    layer: "Operations",
  },
  {
    id: "method-14",
    name: "Method 14",
    type: AssetType.METHOD,
    slug: "method-14",
    segmentIds: ["segment-07", "segment-08"],
    valueStreamStage: "ITERATE",
    sdlcStage: "OPERATE",
    decisionType: "ORGANIZATIONAL_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Product",
    profile: "Strategy",
    domain: "Product",
    layer: "Strategy",
  },
  {
    id: "method-15",
    name: "Method 15",
    type: AssetType.METHOD,
    slug: "method-15",
    segmentIds: ["segment-09", "segment-10"],
    valueStreamStage: "DISCOVERY",
    sdlcStage: "ANALYZE",
    decisionType: "DESIGN_DECISION",
    organizationalMaturity: "FOUNDATION",
    role: "Architect",
    profile: "Delivery",
    domain: "Product",
    layer: "Design",
  },
  {
    id: "method-16",
    name: "Method 16",
    type: AssetType.METHOD,
    slug: "method-16",
    segmentIds: ["segment-09"],
    valueStreamStage: "BUILD",
    sdlcStage: "BUILD",
    decisionType: "ARCHITECTURAL_DECISION",
    organizationalMaturity: "INTERMEDIATE",
    role: "Engineer",
    profile: "Delivery",
    domain: "Data",
    layer: "Implementation",
  },
  {
    id: "method-17",
    name: "Method 17",
    type: AssetType.METHOD,
    slug: "method-17",
    segmentIds: ["segment-10"],
    valueStreamStage: "RUN",
    sdlcStage: "OPERATE",
    decisionType: "TECHNOLOGY_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Engineer",
    profile: "Quality",
    domain: "Platform",
    layer: "Operations",
  },
  {
    id: "method-18",
    name: "Method 18",
    type: AssetType.METHOD,
    slug: "method-18",
    segmentIds: ["segment-09", "segment-10"],
    valueStreamStage: "ITERATE",
    sdlcStage: "OPERATE",
    decisionType: "ORGANIZATIONAL_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Product",
    profile: "Strategy",
    domain: "Product",
    layer: "Strategy",
  },
  {
    id: "concept-01",
    name: "Concept 01",
    type: AssetType.CONCEPT,
    slug: "concept-01",
    segmentIds: ["segment-01", "segment-04"],
    valueStreamStage: "DISCOVERY",
    sdlcStage: "ANALYZE",
    decisionType: "ARCHITECTURAL_DECISION",
    organizationalMaturity: "FOUNDATION",
    role: "Architect",
    profile: "Strategy",
    domain: "Platform",
    layer: "Strategy",
  },
  {
    id: "concept-02",
    name: "Concept 02",
    type: AssetType.CONCEPT,
    slug: "concept-02",
    segmentIds: ["segment-03", "segment-06"],
    valueStreamStage: "BUILD",
    sdlcStage: "DESIGN",
    decisionType: "DESIGN_DECISION",
    organizationalMaturity: "INTERMEDIATE",
    role: "Engineer",
    profile: "Delivery",
    domain: "Product",
    layer: "Design",
  },
  {
    id: "tool-01",
    name: "Tool 01",
    type: AssetType.TOOL,
    slug: "tool-01",
    segmentIds: ["segment-05", "segment-08"],
    valueStreamStage: "RUN",
    sdlcStage: "OPERATE",
    decisionType: "TECHNOLOGY_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Engineer",
    profile: "Quality",
    domain: "Data",
    layer: "Operations",
  },
  {
    id: "tool-02",
    name: "Tool 02",
    type: AssetType.TOOL,
    slug: "tool-02",
    segmentIds: ["segment-02", "segment-07"],
    valueStreamStage: "ITERATE",
    sdlcStage: "OPERATE",
    decisionType: "ORGANIZATIONAL_DECISION",
    organizationalMaturity: "INTERMEDIATE",
    role: "Product",
    profile: "Delivery",
    domain: "Platform",
    layer: "Strategy",
  },
  {
    id: "tech-01",
    name: "Technology 01",
    type: AssetType.TECHNOLOGY,
    slug: "technology-01",
    segmentIds: ["segment-01", "segment-09"],
    valueStreamStage: "BUILD",
    sdlcStage: "BUILD",
    decisionType: "TECHNOLOGY_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Engineer",
    profile: "Delivery",
    domain: "Platform",
    layer: "Implementation",
  },
  {
    id: "tech-02",
    name: "Technology 02",
    type: AssetType.TECHNOLOGY,
    slug: "technology-02",
    segmentIds: ["segment-04", "segment-10"],
    valueStreamStage: "RUN",
    sdlcStage: "OPERATE",
    decisionType: "ARCHITECTURAL_DECISION",
    organizationalMaturity: "ADVANCED",
    role: "Architect",
    profile: "Quality",
    domain: "Data",
    layer: "Operations",
  },
];

export const valueStreamStages: ValueStreamStage[] = ["DISCOVERY", "BUILD", "RUN", "ITERATE"];
export const sdlcStages: SdlcStage[] = ["ANALYZE", "DESIGN", "BUILD", "OPERATE"];
export const decisionTypes: DecisionType[] = ["DESIGN_DECISION", "ARCHITECTURAL_DECISION", "ORGANIZATIONAL_DECISION", "TECHNOLOGY_DECISION"];
export const organizationalMaturities: OrganizationalMaturity[] = ["FOUNDATION", "INTERMEDIATE", "ADVANCED"];
export const roles: Role[] = ["Architect", "Engineer", "Product"];
export const profiles: Profile[] = ["Strategy", "Delivery", "Quality"];
export const domains: Domain[] = ["Platform", "Product", "Data"];
export const layers: Layer[] = ["Strategy", "Design", "Implementation", "Operations"];
