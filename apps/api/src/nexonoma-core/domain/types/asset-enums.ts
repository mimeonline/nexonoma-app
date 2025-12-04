export enum AssetType {
  // --- STRUCTURE TYPES ---
  // Bilden das Skelett / die Navigation
  MACRO_CLUSTER = 'macroCluster',
  CLUSTER = 'cluster',
  SEGMENT = 'segment',
  CLUSTER_VIEW = 'clusterView', // Optional, falls Views als Assets gespeichert werden

  // --- CONTENT TYPES ---
  // Das eigentliche Wissen (mit Tradeoffs, Metrics, UseCases)
  CONCEPT = 'concept',
  METHOD = 'method',
  TOOL = 'tool',
  TECHNOLOGY = 'technology',

  // --- CONTEXT TYPES ---
  // Organisatorischer Kontext
  ROLE = 'role',
}

export enum AssetStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
}
