import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path'; // fs wird nicht mehr gebraucht
import { NexonomaCoreModule } from './nexonoma-core/nexonoma-core.module';
import { Neo4jModule } from './shared/infrastructure/neo4j/neo4j.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        // WICHTIG: Das hier reicht, wenn Schritt 2 & 3 gemacht sind!
        // __dirname zeigt im Build auf 'dist/apps/api/src'
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'locale']),
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    Neo4jModule,
    NexonomaCoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
