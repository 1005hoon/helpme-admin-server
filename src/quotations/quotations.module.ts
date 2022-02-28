import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { __MARKETING_DB__ } from 'src/utils/constants';
import {
  QuotationAdditional,
  QuotationAdditionalSchema,
} from './quotation-additional.schema';
import { QuotationAdditionalService } from './quotation-additionals.service';
import {
  QuotationContent,
  QuotationContentSchema,
} from './quotation-content.schema';
import { QuotationMemo, QuotationMemoSchema } from './quotation-memo.schema';
import {
  QuotationSearch,
  QuotationSearchSchema,
} from './quotation-search.schema';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: QuotationSearch.name, schema: QuotationSearchSchema },
        { name: QuotationContent.name, schema: QuotationContentSchema },
        { name: QuotationMemo.name, schema: QuotationMemoSchema },
        { name: QuotationAdditional.name, schema: QuotationAdditionalSchema },
      ],
      __MARKETING_DB__,
    ),
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService, QuotationAdditionalService],
})
export class QuotationsModule {}
