// src/shared/infrastructure/neo4j/neo4j.config.ts
import { registerAs } from '@nestjs/config';

export const neo4jConfig = registerAs('neo4j', () => ({
  uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
  username: process.env.NEO4J_USER || 'neo4j',
  password: process.env.NEO4J_PASSWORD || 'test',
  database: process.env.NEO4J_DB || undefined, // undefined = default DB
}));
