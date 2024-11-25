import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS Masterclass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:4000')
    .setTermsOfService('http://localhost:4000/terms-of-service')
    .setLicense('MIT License', 'http://www.opensource')
    .addServer('http://localhost:4000')
    .setVersion('1.0')
    .build();

  // Instantiate Document
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
