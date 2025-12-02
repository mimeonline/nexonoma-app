import { newId } from '../../../common/utils/uuid.util';
import { CatalogAggregate } from '../../../domain/catalog/catalog.aggregate';
import { CatalogEntity } from '../../../domain/catalog/catalog.entity';

export type CatalogItemDto = Record<string, unknown> & {
  id: string;
  name: string;
  slug: string;
  type: string;
  shortDescription: string;
  longDescription: string;
};

export class CatalogResponseDto {
  data: {
    items: CatalogItemDto[];
  };

  meta: {
    requestId: string;
    timestamp: string;
    page: number;
    pageSize: number;
    total: number;
  };

  errors: unknown[];

  constructor(aggregate: CatalogAggregate) {
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

  private mapItem(item: CatalogEntity): CatalogItemDto {
    const plain = item.toPlain();

    return {
      ...plain,
      id: item.id,
      name: item.name,
      slug: item.slug,
      type: item.type,
      shortDescription: item.shortDescription,
      longDescription: item.longDescription,
    } as CatalogItemDto;
  }
}
