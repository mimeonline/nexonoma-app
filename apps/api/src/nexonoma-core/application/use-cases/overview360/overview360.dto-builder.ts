import type { Overview360Record } from '../../../infrastructure/persistence/neo4j/overview360/overview360-record.mapper';
import type { Overview360ItemDto } from '../../dtos/overview360/overview360-item.dto';

export class Overview360DtoBuilder {
  static buildItem(record: Overview360Record): Overview360ItemDto {
    return {
      id: record.id,
      slug: record.slug,
      type: record.type,
      name: record.name ?? record.slug,
      icon: record.icon ?? null,
      shortDescription: record.shortDescription ?? '',
      decisionType: record.decisionType ?? null,
      cognitiveLoad: record.cognitiveLoad ?? null,
    };
  }
}
