import { Injectable } from '@nestjs/common';
import { GridRepositoryPort } from '../../../application/grid/ports/grid.repository.port';
import { GridAggregate } from '../../../domain/grid/grid.aggregate';
import { Neo4jService } from './neo4j.service';

@Injectable()
export class GridRepositoryNeo4j implements GridRepositoryPort {
  constructor(private readonly neo: Neo4jService) {}

  async loadGrid(): Promise<GridAggregate> {
    const query = `
      MATCH (mc:Macrocluster)
      OPTIONAL MATCH (mc)-[:CONTAINS]->(c:Cluster)
      RETURN mc, collect(c) AS clusters
    `;

    const rows = await this.neo.run(query);

    return GridAggregate.fromNeo4j(rows);
  }
}
