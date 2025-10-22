import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const port = process.env.APP_PORT ?? 3006;
  const appVersion = process.env.APP_VERSION ?? 'v1';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  app.enableCors();
  app.setGlobalPrefix(`/api/${appVersion}`);

  logger.log(`The application starting... on port: ${port}`);
  await app.listen(port);
}
void bootstrap();
