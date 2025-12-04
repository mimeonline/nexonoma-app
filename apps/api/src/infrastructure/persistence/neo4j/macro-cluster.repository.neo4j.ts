import { Injectable, Logger } from '@nestjs/common';
import { MacroClusterRepositoryPort } from '../../../application/macro-cluster/ports/macro-cluster.repository.port';
import { MacroClusterAggregate } from '../../../domain/macro-cluster/macro-cluster.aggregate';
import { MacroClusterEntity } from '../../../domain/macro-cluster/macro-cluster.entity';
import { Neo4jService } from './neo4j.service';

@Injectable()
export class MacroClusterRepositoryNeo4j implements MacroClusterRepositoryPort {
  private readonly logger = new Logger(MacroClusterRepositoryNeo4j.name);

  constructor(private readonly neo: Neo4jService) {}

  async loadMacroClusters(): Promise<MacroClusterAggregate> {
    const query = `
      MATCH (mc:Macrocluster)
      RETURN mc, null AS c, null AS cv, null AS s, null AS content
      ORDER BY mc.name
    `;

    const rows = await this.neo.run(query);
    this.logger.debug(`Summary: MacroClusters=${(rows as any[]).length}`);

    return MacroClusterAggregate.fromNeo4j(rows as any);
  }

  async loadMacroClusterById(id: string): Promise<MacroClusterEntity | null> {
    const query = `
      MATCH (mc:Macrocluster {id: $id})
      RETURN mc, null AS c, null AS cv, null AS s, null AS content
      LIMIT 1
    `;

    const rows = await this.neo.run(query, { id });
    const aggregate = MacroClusterAggregate.fromNeo4j(rows as any);

    return aggregate.items[0] ?? null;
  }
}
