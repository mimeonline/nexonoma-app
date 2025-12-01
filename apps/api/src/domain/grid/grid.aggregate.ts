import { GridEntity } from './grid.entity';
import { GridRow } from './grid.types';

export class GridAggregate {
  constructor(public readonly clusters: GridEntity[]) {}

  static fromNeo4j(rows: GridRow[]): GridAggregate {
    const clusters: GridEntity[] = [];

    for (const row of rows) {
      const node = row.mc;
      const clusterEntities = row.clusters.map((c: any) =>
        new GridEntity({
          id: c.id,
          name: c.name,
          slug: c.slug,
          type: c.type,
        }),
      );

      clusters.push(
        new GridEntity({
          id: node.id,
          name: node.name,
          slug: node.slug,
          type: node.type,
          children: clusterEntities,
        }),
      );
    }

    return new GridAggregate(clusters);
  }
}
