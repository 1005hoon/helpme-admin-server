import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminUser, AdminUserDocument } from './admin-user.schema';
import { AdminUserGroup, AdminUserRole } from './admin-user.enum';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectModel(AdminUser.name)
    private readonly adminUser: Model<AdminUserDocument>,
  ) {}

  public async getUserByEmail(email: string) {
    const user = await this.adminUser.findOne({ email });

    if (!user) {
      throw new NotFoundException(`${email}는 등록되지 않은 이메일입니다`);
    }

    return user;
  }

  public async getUserById(id: string) {
    const user = await this.adminUser.findById(id);

    if (!id) {
      throw new NotFoundException(
        `${id}에 해당하는 어드민 사용자가 존재하지 않습니다`,
      );
    }

    return user;
  }

  public createUserWithGoogle(
    email: string,
    name: string,
    thumbnail_url: string,
  ) {
    return this.adminUser.create({
      email,
      name,
      thumbnail_url,
      role: AdminUserRole.MEMBER,
      group: AdminUserGroup.CORP_REG,
    });
  }
}
