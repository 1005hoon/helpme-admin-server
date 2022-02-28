import { QuotationMemoDocument } from '../quotation-memo.schema';
import { QuotationSearchDocument } from '../quotation-search.schema';
import { QuotationMapper } from './create-quotation.dto';

export class UpdateQuotationDto {
  search: QuotationSearchDocument;
  quotations: QuotationMapper;
  memos: QuotationMemoDocument[];
}
