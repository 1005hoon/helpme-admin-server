import { QuotationMemoDocument } from '../quotation-memo.schema';
import { QuotationSearchDocument } from '../quotation-search.schema';

export interface QuotationMapper {
  [key: string]: Partial<QuotationSearchDocument>;
}

export class CreateQuotationDto {
  search: Partial<QuotationSearchDocument>;
  quotations: QuotationMapper;
  memos: QuotationMemoDocument[];
}
