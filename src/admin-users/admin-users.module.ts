import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { __PROD__ } from 'src/utils/constants';
import { AdminUser, AdminUserSchema } from './admin-user.schema';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AdminUser.name, schema: AdminUserSchema }],
      __PROD__ ? 'DB_MARKETING' : 'DB_MARKETING_DEV',
    ),
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminUsersModule {}
