import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type QuotationAdditionalDocument = QuotationAdditional & Document;

@Schema({
  collection: 'quotation_additionals',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class QuotationAdditional {
  @Prop()
  categories: String[];

  @Prop({
    unique: true,
    required: true,
    message: '추가사항의 유형을 입력해주세요',
  })
  type: String;

  @Prop({ required: true, message: '견적이 삽입될 위치를 지정해주세요' })
  position: String;

  @Prop({ required: true, message: '견적 내용을 지정해주세요' })
  content: String;

  @Prop({ default: false })
  public is_deleted: boolean;

  @Prop()
  public deleted_at?: Date;

  @Prop({ default: new Date(), type: mongooseSchema.Types.Date })
  public created_at: Date;

  @Prop({ default: new Date(), type: mongooseSchema.Types.Date })
  public updated_at: Date;
}

export const QuotationAdditionalSchema =
  SchemaFactory.createForClass(QuotationAdditional);
