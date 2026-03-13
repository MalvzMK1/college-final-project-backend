import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  const configService = app.get(ConfigService);
  const corsAllowedOrigins = configService.get<string>(
    'API_CORS_ORIGINS',
    '*',
  );

  const corsAllowedHeaders = configService
    .get<string>('API_CORS_HEADERS', '')
    ?.split(',');

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: corsAllowedOrigins === '*' 
      ? true 
      : corsAllowedOrigins.split(','),

    methods: configService
      .get<string>('API_CORS_METHODS', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
      .split(','),

    allowedHeaders: corsAllowedHeaders,

    credentials:
      corsAllowedOrigins === '*'
        ? false
        : !!+configService.get<string>('API_CORS_ALLOW_CREDENTIALS', '1'),

    maxAge: 24 * 60 * 60,
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
