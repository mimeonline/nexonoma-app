import type { GridNodeRecord } from '../../../infrastructure/persistence/neo4j/grid/grid-record.mapper';

export abstract class GridRepositoryPort {
  // Page 1: Einstieg
  abstract findMacroClusters(locale: string): Promise<GridNodeRecord[]>;

  // Page 2 & 3: Findet ein Strukturelement (Macro, Cluster, Segment) anhand Slug
  abstract findStructuralBySlug(
    locale: string,
    slug: string,
  ): Promise<GridNodeRecord | null>;

  // Findet alle Kinder eines Parents (egal ob Structure oder Content)
  abstract findChildren(locale: string, parentId: string): Promise<GridNodeRecord[]>;
}
