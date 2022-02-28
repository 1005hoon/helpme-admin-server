import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminUserDocument = AdminUser & Document;

@Schema({ collection: 'admin_users' })
export class AdminUser {
  @Prop()
  public name: string;

  @Prop()
  public role: string;

  @Prop()
  public email: string;

  @Prop()
  public group: string;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
