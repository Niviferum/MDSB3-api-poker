import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  
  app.enableCors();

  
  const config = new DocumentBuilder()
    .setTitle('Poker API')
    .setDescription('API pour application de poker Texas Hold\'em')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3030;
  await app.listen(port);
  
  console.log(`Application de poker lancée sur http://localhost:${port}`);
  console.log(`Documentation Swagger : http://localhost:${port}/api`);
}

bootstrap();
