import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  private readonly logger = new Logger(Neo4jService.name);
  private readonly driver: Driver;
  private readonly database?: string;

  constructor(private readonly config: ConfigService) {
    this.driver = neo4j.driver(
      this.config.get<string>('NEO4J_URI')!,
      neo4j.auth.basic(
        this.config.get<string>('NEO4J_USER')!,
        this.config.get<string>('NEO4J_PASSWORD')!,
      ),
    );

    // DB-Name aus .env, z. B. "nexonoma"
    this.database = this.config.get<string>('NEO4J_DB') || undefined;

    this.logger.log(
      `Neo4j driver initialisiert. URI=${this.config.get<string>('NEO4J_URI')} DB=${
        this.database ?? '<default>'
      }`,
    );
  }

  getSession(): Session {
    if (this.database) {
      this.logger.debug(`Opening session for database \"${this.database}\"`);
      return this.driver.session({ database: this.database });
    }

    this.logger.debug('Opening session using Neo4j default database');
    return this.driver.session();
  }

  async run(query: string, params: Record<string, any> = {}) {
    const session = this.getSession();
    
    try {
      const result = await session.run(query, params);
      this.logger.debug(`Query returned ${result.records.length}.`);

      if (result.records[0]) {
        const first = result.records[0];

        const mc = first.get('mc');
        const clusters = first.get('clusters');
      }

      const rows = result.records.map((r) => ({
        mc: r.get('mc'),
        clusters: r.get('clusters'),
      }));

      return rows;
    } catch (error) {
      this.logger.error(
        `Error running Neo4j query: ${query} with params ${JSON.stringify(
          params,
        )}`,
        (error as Error).stack,
      );
      throw error;
    } finally {
      await session.close();
    }
  }
}