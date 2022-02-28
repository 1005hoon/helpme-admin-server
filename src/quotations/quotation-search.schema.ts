import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { QuotationMemo } from './quotation-memo.schema';

export type QuotationSearchDocument = QuotationSearch & Document;

@Schema({
  collection: 'quotation_searches',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class QuotationSearch {
  @Prop({
    required: true,
    message: '제출유형을 입력해주세요',
  })
  submissionType: String;

  @Prop({
    required: true,
    message: '등기유형을 입력해주세요',
  })
  registrationType: String;

  @Prop({
    required: true,
    message: '등기목적을 입력해주세요',
  })
  registrationPurpose: String;

  @Prop({
    required: true,
    message: '상세목적을 입력해주세요',
  })
  detailedPurpose: String;

  @Prop({
    required: true,
    message: '검색어 설정 실패 - 담당자에게 노티해주세요',
  })
  keyword: String;

  @Prop({
    required: true,
    message: '견적에 해당하는 카테고리를 선택하세요',
  })
  categories: String;

  @Prop({
    type: [
      {
        type: mongooseSchema.Types.ObjectId,
        ref: QuotationMemo.name,
        required: false,
      },
    ],
  })
  memo: QuotationMemo[];

  @Prop({ default: false })
  public is_deleted: boolean;

  @Prop()
  public deleted_at?: Date;

  @Prop({ default: new Date(), type: mongooseSchema.Types.Date })
  public created_at: Date;

  @Prop({ default: new Date(), type: mongooseSchema.Types.Date })
  public updated_at: Date;
}

export const QuotationSearchSchema =
  SchemaFactory.createForClass(QuotationSearch);

QuotationSearchSchema.index({
  keyword: 'text',
});

QuotationSearchSchema.virtual('quotations', {
  ref: 'QuotationsContent',
  localField: '_id',
  foreignField: 'search',
  justOne: false,
});

QuotationSearchSchema.virtual('additionals', {
  ref: 'QuotationsAdditional',
  localField: 'categories',
  foreignField: 'categories',
  justOne: false,
  match: (doc: QuotationSearch) => ({ categories: doc.categories }),
});
