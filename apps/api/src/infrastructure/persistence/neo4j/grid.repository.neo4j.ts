import { Injectable, Logger } from '@nestjs/common';
import { GridRepositoryPort } from '../../../application/grid/ports/grid.repository.port';
import { GridAggregate } from '../../../domain/grid/grid.aggregate';
import { Neo4jService } from './neo4j.service';

@Injectable()
export class GridRepositoryNeo4j implements GridRepositoryPort {
  private readonly logger = new Logger(GridRepositoryNeo4j.name);

  constructor(private readonly neo: Neo4jService) {}

  async loadGrid(): Promise<GridAggregate> {
    const query = `
      MATCH (mc:Macrocluster)
      OPTIONAL MATCH (mc)-[:CONTAINS]->(c:Cluster)
      WITH mc, collect(DISTINCT c) AS clusters
      RETURN mc, clusters
      ORDER BY mc.name
    `;

    const rows = await this.neo.run(query);

    const mcCount = rows.length;
    const clusterCount = rows.reduce(
      (sum, r) => sum + (Array.isArray(r.clusters) ? r.clusters.length : 0),
      0,
    );

    this.logger.debug(
      `Summary: MacroClusters=${mcCount}, Clusters=${clusterCount}`,
    );

    return GridAggregate.fromNeo4j(rows);
  }
}
