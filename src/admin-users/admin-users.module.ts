import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { __MARKETING_DB__, __PROD__ } from 'src/utils/constants';
import { AdminUser, AdminUserSchema } from './admin-user.schema';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AdminUser.name, schema: AdminUserSchema }],
      __MARKETING_DB__,
    ),
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminUsersModule {}
