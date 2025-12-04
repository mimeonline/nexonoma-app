import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import neo4j from 'neo4j-driver';
import { neo4jConfig } from './neo4j.config';
import { Neo4jService } from './neo4j.service';
// ÄNDERUNG: Import aus .constants
import { NEO4J_DRIVER } from './neo4j.constants';

@Global()
@Module({
  imports: [ConfigModule.forFeature(neo4jConfig)],
  providers: [
    {
      provide: NEO4J_DRIVER,
      useFactory: async (config: ConfigType<typeof neo4jConfig>) => {
        const driver = neo4j.driver(
          config.uri,
          neo4j.auth.basic(config.username, config.password),
        );
        await driver.verifyConnectivity();
        return driver;
      },
      inject: [neo4jConfig.KEY],
    },
    Neo4jService,
  ],
  exports: [Neo4jService],
})
export class Neo4jModule {}
