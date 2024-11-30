import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

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
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Masterclass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:4000')
    .setTermsOfService('http://localhost:4000/terms-of-service')
    .setLicense('MIT License', 'http://www.opensource')
    .addServer('http://localhost:4000')
    .setVersion('1.0')
    .build();

  // Instantiate Document
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  // Set up the aws sdk used uploading the files to aws s3 bucket
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId'),
      secretAccessKey: configService.get('appConfig.awsSecretAccessKey'),
    },
    region: configService.get('appConfig.awsRegion'),
  });

  // enable cors
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
