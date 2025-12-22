import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { FileLogger } from './shared/infrastructure/logging/file-logger';

dotenv.config();

async function bootstrap() {
  const fileLoggingEnabled = Boolean(process.env.LOG_FILE?.trim() || process.env.LOG_DIR?.trim());
  const logger = new FileLogger({ serviceName: 'api' });
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  const config = new DocumentBuilder()
    .setTitle('Nexonoma API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  if (fileLoggingEnabled) {
    logger.log(`API server started on port ${port}`, 'bootstrap');
  }
}
void bootstrap();
