import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { QuotationSearch } from './quotation-search.schema';

export type QuotationContentDocument = QuotationContent & Document;

@Schema({
  collection: 'quotation_contents',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class QuotationContent {
  @Prop({ required: true, message: '견적 위치를 지정해주세요' })
  position: String;

  @Prop({ required: true, message: '견적 내용을 지정해주세요' })
  content: String;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: QuotationSearch.name })
  search: QuotationSearch;
}

export const QuotationContentSchema =
  SchemaFactory.createForClass(QuotationContent);
