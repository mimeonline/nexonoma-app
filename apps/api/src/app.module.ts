import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NexonomaCoreModule } from './nexonoma-core/nexonoma-core.module';
import { Neo4jModule } from './shared/infrastructure/neo4j/neo4j.module';
@Module({
  imports: [
    // 1. Config laden: Das muss als allererstes passieren
    ConfigModule.forRoot({
      isGlobal: true, // Macht ConfigService überall verfügbar
      envFilePath: '.env', // Optional, standardmäßig wird im Root gesucht
    }),

    // 2. Shared Modules: Globale Infrastruktur bereitstellen
    Neo4jModule,
    // Da Neo4jModule @Global() ist, ist der Service jetzt in der ganzen App verfügbar

    // 3. Feature Modules: Deine eigentliche Business-Logik
    NexonomaCoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
