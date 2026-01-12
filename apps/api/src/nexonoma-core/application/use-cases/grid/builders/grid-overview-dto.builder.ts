import type { GridNodeRecord } from '../../../../infrastructure/persistence/neo4j/grid/grid-record.mapper';
import type { GridOverviewResponseDto } from '../../../dtos/grid/grid-overview-response.dto';
import { buildOverviewItem } from './grid-dto-helpers';

export class GridOverviewDtoBuilder {
  static build(
    records: GridNodeRecord[],
    locale: string,
  ): GridOverviewResponseDto {
    return records.map((record) => buildOverviewItem(record, locale));
  }
}
