import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AdminUsersModule } from './admin-users/admin-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number(),
        NODE_ENV: Joi.string(),
        DB_PROD: Joi.string(),
        DB_MARKETING: Joi.string(),
        DB_MARKETING_DEV: Joi.string(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    AdminUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
