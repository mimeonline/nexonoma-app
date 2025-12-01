import { Injectable } from '@nestjs/common';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  private readonly driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
      )
    );
  }

  getSession(database = 'nexonoma'): Session {
    return this.driver.session({ database });
  }

  async run<T = any>(
    query: string,
    params: Record<string, any> = {}
  ): Promise<T[]> {
    const session = this.getSession();

    const result = await session.run(query, params);
    await session.close();

    return result.records.map((r) => r.toObject() as T);
  }
}
