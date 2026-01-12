import type { GridNodeRecord } from '../../../../infrastructure/persistence/neo4j/grid/grid-record.mapper';
import type { MacroClusterViewResponseDto } from '../../../dtos/grid/macrocluster-view-response.dto';
import { buildOverviewItem } from './grid-dto-helpers';

export class MacroClusterViewDtoBuilder {
  static build(
    macroCluster: GridNodeRecord,
    clusters: GridNodeRecord[],
    locale: string,
  ): MacroClusterViewResponseDto {
    return {
      macroCluster: buildOverviewItem(macroCluster, locale),
      clusters: clusters.map((cluster) => buildOverviewItem(cluster, locale)),
    };
  }
}
