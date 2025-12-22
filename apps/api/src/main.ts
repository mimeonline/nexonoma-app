import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { FileLogger } from './shared/infrastructure/logging/file-logger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new FileLogger({ serviceName: 'api' }),
  });
  const config = new DocumentBuilder()
    .setTitle('Nexonoma API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
