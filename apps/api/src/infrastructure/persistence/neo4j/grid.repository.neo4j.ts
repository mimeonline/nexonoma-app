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
      OPTIONAL MATCH (c)-[:CONTAINS]->(cv:Clusterview)
      OPTIONAL MATCH (cv)-[:CONTAINS]->(s:Segment)
      OPTIONAL MATCH (s)-[:RELATED_TO]->(content)
      WHERE content:Concept OR content:Method OR content:Tool OR content:Technology

      RETURN mc, c, cv, s, content
      ORDER BY mc.name, c.name, s.name
    `;

    const rows = await this.neo.run(query);

    // Echte Anzahl unterschiedlicher MacroCluster & Cluster ermitteln
    const mcIds = new Set<string>();
    const clusterIds = new Set<string>();

    for (const r of rows as any[]) {
      const mcNode = r.mc as { properties?: { id?: string } } | null;
      const cNode = r.c as { properties?: { id?: string } } | null;

      const mcId = mcNode?.properties?.id;
      const cId = cNode?.properties?.id;

      if (mcId) {
        mcIds.add(mcId);
      }
      if (cId) {
        clusterIds.add(cId);
      }
    }

    this.logger.debug(
      `Summary: MacroClusters=${mcIds.size}, Clusters=${clusterIds.size}`,
    );

    return GridAggregate.fromNeo4j(rows);
  }
}
