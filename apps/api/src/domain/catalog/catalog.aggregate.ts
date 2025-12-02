// src/domain/catalog/catalog.aggregate.ts
import { CatalogEntity } from './catalog.entity';
import { CatalogRow } from './catalog.types';

interface ContentNode {
  properties?: Record<string, unknown>;
  labels?: string[];
}

export class CatalogAggregate {
  constructor(public readonly items: CatalogEntity[]) {}

  static fromNeo4j(rows: CatalogRow[]): CatalogAggregate {
    const items: CatalogEntity[] = [];
    const itemMap = new Map<string, CatalogEntity>();

    for (const row of rows) {
      const contentNode = (row as any).content as ContentNode | null;
      const props = contentNode?.properties ?? {};
      const id = (props as any).id as string | undefined;

      if (!id) {
        continue;
      }

      if (itemMap.has(id)) {
        continue;
      }

      const type = CatalogAggregate.resolveType(props, contentNode?.labels ?? []);

      const entity = new CatalogEntity({
        id,
        name: ((props as any).name as string) ?? '',
        slug: ((props as any).slug as string) ?? '',
        type,
        shortDescription: (props as any).shortDescription as string | undefined,
        longDescription: (props as any).longDescription as string | undefined,
        attributes: { ...props },
      });

      itemMap.set(id, entity);
      items.push(entity);
    }

    return new CatalogAggregate(items);
  }

  private static resolveType(
    props: Record<string, unknown>,
    labels: string[],
  ): string {
    if (labels.includes('Concept')) {
      return 'concept';
    }
    if (labels.includes('Method')) {
      return 'method';
    }
    if (labels.includes('Tool')) {
      return 'tool';
    }
    if (labels.includes('Technology')) {
      return 'technology';
    }

    const rawType = props.type as string | undefined;
    return rawType ?? '';
  }
}
