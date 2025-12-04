import { MacroClusterEntity } from './macro-cluster.entity';
import { MacroClusterRow } from './macro-cluster.types';

interface MacroClusterNode {
  properties?: Record<string, unknown>;
  labels?: string[];
}

export class MacroClusterAggregate {
  constructor(public readonly items: MacroClusterEntity[]) {}

  static fromNeo4j(rows: MacroClusterRow[]): MacroClusterAggregate {
    const items: MacroClusterEntity[] = [];
    const map = new Map<string, MacroClusterEntity>();

    for (const row of rows) {
      const mcNode = (row as any).mc as MacroClusterNode | null;
      const props = mcNode?.properties ?? {};
      const id = (props as any).id as string | undefined;

      if (!id) {
        continue;
      }

      if (map.has(id)) {
        continue;
      }

      const entity = new MacroClusterEntity({
        id,
        name: (props as any).name as string | undefined,
        slug: (props as any).slug as string | undefined,
        shortDescription: (props as any).shortDescription as string | undefined,
        longDescription: (props as any).longDescription as string | undefined,
        status: (props as any).status as string | undefined,
        version: (props as any).version as string | undefined,
        createdAt: (props as any).createdAt as string | undefined,
        updatedAt: (props as any).updatedAt as string | undefined,
        author: (props as any).author as string | undefined,
        contributor: (props as any).contributor as string[] | undefined,
        license: (props as any).license as string | undefined,
        language: (props as any).language as string | undefined,
        tags: (props as any).tags as string[] | undefined,
        organizationalLevel: (props as any).organizationalLevel as string[] | undefined,
        customFields: (props as any).customFields as Record<string, unknown> | undefined,
        abbreviation: (props as any).abbreviation as string | undefined,
        attributes: { ...props },
      });

      map.set(id, entity);
      items.push(entity);
    }

    return new MacroClusterAggregate(items);
  }
}
