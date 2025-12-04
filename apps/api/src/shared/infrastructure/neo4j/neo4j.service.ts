import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import {
  Driver,
  Record as Neo4jRecord,
  Session,
  SessionMode,
} from 'neo4j-driver';
import { neo4jConfig } from './neo4j.config';
// ÄNDERUNG: Import aus .constants statt .module
import { NEO4J_DRIVER } from './neo4j.constants';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  private readonly logger = new Logger(Neo4jService.name);

  constructor(
    @Inject(NEO4J_DRIVER) private readonly driver: Driver,
    @Inject(neo4jConfig.KEY)
    private readonly config: ConfigType<typeof neo4jConfig>,
  ) {}

  async onApplicationShutdown() {
    this.logger.log('Closing Neo4j Driver Connection...');
    await this.driver.close();
  }

  // ... (Rest der Methoden read/write bleibt identisch) ...
  async read(
    query: string,
    params: Record<string, any> = {},
  ): Promise<Neo4jRecord[]> {
    const session = this.getSession('READ');
    // ... (Code wie zuvor)
    try {
      const result = await session.executeRead(async (tx) => {
        const res = await tx.run(query, params);
        return res.records;
      });
      return result;
    } finally {
      await session.close();
    }
  }

  async write(
    query: string,
    params: Record<string, any> = {},
  ): Promise<Neo4jRecord[]> {
    const session = this.getSession('WRITE');
    // ... (Code wie zuvor)
    try {
      const result = await session.executeWrite(async (tx) => {
        const res = await tx.run(query, params);
        return res.records;
      });
      return result;
    } finally {
      await session.close();
    }
  }

  private getSession(defaultAccessMode: SessionMode): Session {
    return this.driver.session({
      database: this.config.database,
      defaultAccessMode,
    });
  }
}
