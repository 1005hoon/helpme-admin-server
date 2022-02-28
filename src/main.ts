import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import { AppModule } from './app.module';
import { __PROD__ } from './utils/constants';

const allowedOrigins = ['http://localhost:3000'];

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  if (!__PROD__) {
    app.use(morgan('dev'));
    mongoose.set('debug', { shell: true });
  }

  const PORT = process.env.PORT || 8080;

  await app.listen(PORT);

  logger.log(`[Application]: ${PORT}에서 서버 실행중`);
}
bootstrap();
