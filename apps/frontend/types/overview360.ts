export type Overview360Item = {
  id: string;
  slug: string;
  type: string;
  name: string;
  icon: string | null;
  shortDescription: string;
  decisionType: string | null;
  cognitiveLoad: string | null;
};

export type Overview360Response = {
  foundational: Overview360Item[];
  structural: Overview360Item[];
  atomic: Overview360Item[];
};
