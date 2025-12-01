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

    // Maps zur Wiederverwendung, damit wir keine Duplikate erzeugen
    const macroMap = new Map<string, GridEntity>();
    const clusterMap = new Map<string, GridEntity>();

    for (const row of rows) {
      // MacroCluster
      const mcNode = (row as any).mc as { properties?: NodeProps } | null;
      const mcProps: NodeProps = mcNode?.properties ?? {};

      if (!mcProps.id) {
        continue; // ohne ID kein stabiles Aggregat
      }

      let macro = macroMap.get(mcProps.id);
      if (!macro) {
        macro = new GridEntity({
          id: mcProps.id,
          name: mcProps.name ?? '',
          slug: mcProps.slug ?? '',
          type: mcProps.type ?? '',
          shortDescription: mcProps.shortDescription,
          longDescription: mcProps.longDescription,
          children: [],
        });

        macroMap.set(mcProps.id, macro);
        macroClusters.push(macro);
      }

      // Cluster (optional)
      const cNode = (row as any).c as { properties?: NodeProps } | null;
      const cProps: NodeProps = cNode?.properties ?? {};

      let cluster: GridEntity | undefined;
      if (cProps.id) {
        cluster = clusterMap.get(cProps.id);
        if (!cluster) {
          cluster = new GridEntity({
            id: cProps.id,
            name: cProps.name ?? '',
            slug: cProps.slug ?? '',
            type: cProps.type ?? '',
            shortDescription: cProps.shortDescription,
            longDescription: cProps.longDescription,
            children: [],
          });

          clusterMap.set(cProps.id, cluster);

          // nur anhängen, wenn noch nicht vorhanden
          if (!macro.children.find((child) => child.id === cluster!.id)) {
            (macro.children as GridEntity[]).push(cluster);
          }
        }
      }

      // Segment (optional, hängt unter Cluster)
      const sNode = (row as any).s as { properties?: NodeProps } | null;
      const sProps: NodeProps = sNode?.properties ?? {};

      if (cluster && sProps.id) {
        const exists = cluster.children.some((seg) => seg.id === sProps.id);
        if (!exists) {
          const segment = new GridEntity({
            id: sProps.id,
            name: sProps.name ?? '',
            slug: sProps.slug ?? '',
            type: sProps.type ?? '',
            shortDescription: sProps.shortDescription,
            longDescription: sProps.longDescription,
            children: [],
          });

          (cluster.children as GridEntity[]).push(segment);
        }
      }
    }

    return new GridAggregate(macroClusters);
  }
}
