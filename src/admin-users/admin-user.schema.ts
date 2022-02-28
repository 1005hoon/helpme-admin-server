import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type AdminUserDocument = AdminUser & Document;

@Schema({
  collection: 'admin_users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class AdminUser {
  @Prop()
  public name: string;

  @Prop()
  public role: string;

  @Prop()
  public email: string;

  @Prop()
  public thumbnail_url?: string;

  @Prop()
  public group: string;

  @Prop({ default: false })
  public is_deleted: boolean;

  @Prop()
  public deleted_at?: Date;

  @Prop({ default: new Date(), type: mongooseSchema.Types.Date })
  public created_at: Date;

  @Prop({ default: new Date(), type: mongooseSchema.Types.Date })
  public updated_at: Date;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
