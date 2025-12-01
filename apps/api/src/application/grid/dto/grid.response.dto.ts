import { GridAggregate } from '../../../domain/grid/grid.aggregate';

export class GridResponseDto {
  clusters: any[];

  constructor(aggregate: GridAggregate) {
    this.clusters = aggregate.clusters.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      type: c.type,
      children: c.children.map(ch => ({
        id: ch.id,
        name: ch.name,
        slug: ch.slug,
        type: ch.type,
      })),
    }));
  }
}
