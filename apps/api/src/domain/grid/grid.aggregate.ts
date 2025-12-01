// src/domain/grid/grid.aggregate.ts
import { GridEntity } from './grid.entity';
import { GridRow } from './grid.types';

export class GridAggregate {
  constructor(public readonly clusters: GridEntity[]) {}

  static fromNeo4j(rows: GridRow[]): GridAggregate {
    const clusters: GridEntity[] = [];

    for (const row of rows) {
      const mcNode = row.mc;
      const mcProps = mcNode.properties || {};

      const childEntities = (row.clusters || []).map((c: any) => {
        const p = c.properties || {};
        return new GridEntity({
          id: p.id,
          name: p.name,
          slug: p.slug,
          type: p.type,
        });
      });

      clusters.push(
        new GridEntity({
          id: mcProps.id,
          name: mcProps.name,
          slug: mcProps.slug,
          type: mcProps.type,
          children: childEntities,
        }),
      );
    }

    return new GridAggregate(clusters);
  }
}