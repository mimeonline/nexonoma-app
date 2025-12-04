import { newId } from '../../../common/utils/uuid.util';
import { MacroClusterAggregate } from '../../../domain/macro-cluster/macro-cluster.aggregate';
import { MacroClusterEntity } from '../../../domain/macro-cluster/macro-cluster.entity';

export type MacroClusterItemDto = Record<string, unknown> & {
  id: string;
  name: string;
  slug: string;
  type: 'macroCluster';
  shortDescription: string;
  longDescription: string;
  status: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  contributor: string[];
  license: string;
  language: string;
  tags: string[];
  customFields: Record<string, unknown>;
  organizationalLevel: string[];
  abbreviation?: string;
};

export class MacroClusterResponseDto {
  data: {
    items: MacroClusterItemDto[];
  };

  meta: {
    requestId: string;
    timestamp: string;
    page: number;
    pageSize: number;
    total: number;
  };

  errors: unknown[];

  constructor(aggregate: MacroClusterAggregate) {
    const items = aggregate.items.map((item) => this.mapItem(item));

    this.data = { items };
    this.meta = {
      requestId: newId(),
      timestamp: new Date().toISOString(),
      page: 1,
      pageSize: items.length,
      total: items.length,
    };
    this.errors = [];
  }

  private mapItem(item: MacroClusterEntity): MacroClusterItemDto {
    const plain = item.toPlain();

    return {
      ...plain,
      id: item.id,
      name: item.name,
      slug: item.slug,
      type: item.type,
      shortDescription: item.shortDescription,
      longDescription: item.longDescription,
    };
  }
}
