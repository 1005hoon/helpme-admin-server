import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as mongooseSchema } from 'mongoose';

export type RepsExpirationDocument = RepsExpiration & Document;

@Schema({
  collection: 'reps_expirations',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class RepsExpiration {
  @Prop()
  public corpId: ObjectId;

  @Prop()
  public corpName: string;

  @Prop()
  public searchTag: string;

  @Prop(
    raw({
      name: { type: String },
      phone: { type: String },
    }),
  )
  public client: Record<string, string>;

  @Prop(
    raw({
      name: { type: String },
      position: { type: String },
      termEnds: { type: String },
    }),
  )
  public boards: Record<string, string>;

  @Prop()
  public messaged_at?: Date;

  @Prop({ default: false })
  public is_deleted: boolean;

  @Prop()
  public deleted_at?: Date;

  @Prop({ default: new Date(), type: mongooseSchema.Types.Date })
  public created_at: Date;

  @Prop({ default: new Date(), type: mongooseSchema.Types.Date })
  public updated_at: Date;
}

export const RepsExpirationSchema =
  SchemaFactory.createForClass(RepsExpiration);
