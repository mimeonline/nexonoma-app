// src/domain/grid/grid.aggregate.ts
import { GridContentItem, GridEntity } from './grid.entity';
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
    const segmentMap = new Map<string, GridEntity>();

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

      let segment: GridEntity | undefined;
      if (cluster && sProps.id) {
        segment = segmentMap.get(sProps.id);
        if (!segment) {
          segment = new GridEntity({
            id: sProps.id,
            name: sProps.name ?? '',
            slug: sProps.slug ?? '',
            type: sProps.type ?? '',
            shortDescription: sProps.shortDescription,
            longDescription: sProps.longDescription,
            children: [],
          });

          segmentMap.set(sProps.id, segment);

          const exists = cluster.children.some((seg) => seg.id === sProps.id);
          if (!exists) {
            (cluster.children as GridEntity[]).push(segment);
          }
        }
      }

      // Content (optional, hängt unter Segment)
      const contentNode = (row as any).content as
        | { properties?: NodeProps; labels?: string[] }
        | null;

      if (segment && contentNode && contentNode.properties?.id) {
        const cPropsContent = contentNode.properties as NodeProps;
        const labels: string[] = (contentNode as any).labels ?? [];

        // Kategorie bestimmen: concept | method | tool | technology
        let category: 'concept' | 'method' | 'tool' | 'technology' | undefined;
        if (labels.includes('Concept')) {
          category = 'concept';
        } else if (labels.includes('Method')) {
          category = 'method';
        } else if (labels.includes('Tool')) {
          category = 'tool';
        } else if (labels.includes('Technology')) {
          category = 'technology';
        } else if (cPropsContent.type) {
          const t = cPropsContent.type.toLowerCase();
          if (t === 'concept' || t === 'method' || t === 'tool' || t === 'technology') {
            category = t as typeof category;
          }
        }

        if (category) {
          const item: GridContentItem = {
            id: cPropsContent.id ?? '',
            name: cPropsContent.name ?? '',
            slug: cPropsContent.slug ?? '',
            type: cPropsContent.type ?? category,
            shortDescription: cPropsContent.shortDescription,
            longDescription: cPropsContent.longDescription,
          };

          const segContent = segment.content;

          let targetArray: GridContentItem[];
          switch (category) {
            case 'concept':
              targetArray = segContent.concepts;
              break;
            case 'method':
              targetArray = segContent.methods;
              break;
            case 'tool':
              targetArray = segContent.tools;
              break;
            case 'technology':
              targetArray = segContent.technologies;
              break;
            default:
              targetArray = segContent.concepts;
              break;
          }

          const alreadyExists = targetArray.some((i) => i.id === item.id);
          if (!alreadyExists) {
            targetArray.push(item);
          }
        }
      }
    }

    return new GridAggregate(macroClusters);
  }
}
