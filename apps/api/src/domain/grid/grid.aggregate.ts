// src/domain/grid/grid.aggregate.ts
import { GridEntity } from './grid.entity';
import { GridRow } from './grid.types';

interface NodeProps {
  id?: string;
  name?: string;
  slug?: string;
  type?: string;
  shortDescription?: string;
  longDescription?: string;
}

export class GridAggregate {
  constructor(public readonly macroClusters: GridEntity[]) {}

  static fromNeo4j(rows: GridRow[]): GridAggregate {
    const macroClusters: GridEntity[] = [];

    for (const row of rows) {
      const mcNode = row.mc as { properties?: NodeProps } | null;
      const mcProps: NodeProps = mcNode?.properties ?? {};

      const childEntities = (row.clusters ?? []).map((c) => {
        const node = c as { properties?: NodeProps };
        const p: NodeProps = node.properties ?? {};

        return new GridEntity({
          id: p.id ?? '',
          name: p.name ?? '',
          slug: p.slug ?? '',
          type: p.type ?? '',
          shortDescription: p.shortDescription,
          longDescription: p.longDescription,
        });
      });

      macroClusters.push(
        new GridEntity({
          id: mcProps.id ?? '',
          name: mcProps.name ?? '',
          slug: mcProps.slug ?? '',
          type: mcProps.type ?? '',
          shortDescription: mcProps.shortDescription,
          longDescription: mcProps.longDescription,
          children: childEntities,
        }),
      );
    }

    return new GridAggregate(macroClusters);
  }
}
