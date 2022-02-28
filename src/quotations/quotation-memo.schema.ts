import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type QuotationMemoDocument = QuotationMemo & Document;

@Schema({
  collection: 'quotation_memos',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class QuotationMemo {
  @Prop({ unique: true, required: true, message: '메모 유형을 입력하세요' })
  type: String;

  @Prop({ required: true, message: '메모 내용을 입력하세요' })
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

export const QuotationMemoSchema = SchemaFactory.createForClass(QuotationMemo);
