import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './utils/custom-validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = 3000;
  const currentEnv = configService.get<string>('CURRENT_ENV');

  app.useGlobalPipes(new CustomValidationPipe());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: `http://localhost:${port}`,
    credentials: true,
  });

  setupSwagger(app, currentEnv);

  await app.listen(port);

  const logger = new Logger();
  logger.log(`Application is listening on port ${port}`);
}
bootstrap();

function setupSwagger(app: INestApplication<any>, currentVersion: string) {
  const config = new DocumentBuilder()
    .setTitle('E-Wallet API Docs')
    .setDescription('The E-Wallet API documentation')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (currentVersion !== 'PROD') {
    SwaggerModule.setup('docs', app, document);
  }
}
