export enum AssetType {
  // --- STRUCTURE TYPES ---
  // Bilden das Skelett / die Navigation
  MACRO_CLUSTER = 'MACRO_CLUSTER',
  CLUSTER = 'CLUSTER',
  SEGMENT = 'SEGMENT',
  CLUSTER_VIEW = 'SEGMENT', // Optional, falls Views als Assets gespeichert werden

  // --- CONTENT TYPES ---
  // Das eigentliche Wissen (mit Tradeoffs, Metrics, UseCases)
  CONCEPT = 'CONCEPT',
  METHOD = 'METHOD',
  TOOL = 'TOOL',
  TECHNOLOGY = 'TECHNOLOGY',

  // --- CONTEXT TYPES ---
  // Organisatorischer Kontext
  ROLE = 'ROLE',
}

export enum AssetStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  PUBLISHED = 'PUBLISHED',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}
