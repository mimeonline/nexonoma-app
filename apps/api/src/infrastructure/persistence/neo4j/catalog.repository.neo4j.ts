import { Injectable, Logger } from '@nestjs/common';
import { CatalogRepositoryPort } from '../../../application/catalog/ports/catalog.repository.port';
import { CatalogAggregate } from '../../../domain/catalog/catalog.aggregate';
import { CatalogEntity } from '../../../domain/catalog/catalog.entity';
import { Neo4jService } from './neo4j.service';

@Injectable()
export class CatalogRepositoryNeo4j implements CatalogRepositoryPort {
  private readonly logger = new Logger(CatalogRepositoryNeo4j.name);

  constructor(private readonly neo: Neo4jService) {}

  async loadCatalog(): Promise<CatalogAggregate> {
    const query = `
      MATCH (content)
      WHERE content:Concept OR content:Method OR content:Tool OR content:Technology
      RETURN null AS mc, null AS c, null AS cv, null AS s, content
      ORDER BY content.name
    `;

    const rows = await this.neo.run(query);
    this.logger.debug(`Summary: ContentItems=${(rows as any[]).length}`);

    return CatalogAggregate.fromNeo4j(rows as any);
  }

  async loadCatalogItemById(id: string): Promise<CatalogEntity | null> {
    const query = `
      MATCH (content {id: $id})
      WHERE content:Concept OR content:Method OR content:Tool OR content:Technology
      RETURN null AS mc, null AS c, null AS cv, null AS s, content
      LIMIT 1
    `;

    const rows = await this.neo.run(query, { id });
    const aggregate = CatalogAggregate.fromNeo4j(rows as any);

    return aggregate.items[0] ?? null;
  }
}
