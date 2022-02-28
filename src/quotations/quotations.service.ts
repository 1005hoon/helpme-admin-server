import { Model, FilterQuery } from 'mongoose';
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  QuotationSearch,
  QuotationSearchDocument,
} from './quotation-search.schema';
import {
  QuotationContent,
  QuotationContentDocument,
} from './quotation-content.schema';
import { QuotationMemo, QuotationMemoDocument } from './quotation-memo.schema';
import {
  CreateQuotationDto,
  QuotationMapper,
} from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { __NOW__ } from 'src/utils/constants';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(QuotationSearch.name)
    private readonly search: Model<QuotationSearchDocument>,
    @InjectModel(QuotationContent.name)
    private readonly content: Model<QuotationContentDocument>,
    @InjectModel(QuotationMemo.name)
    private readonly memo: Model<QuotationMemoDocument>,
  ) {}

  public getSearchResultsForRegTypesAndSubmitOption(query) {
    if (query.keyword) {
      const { keyword } = query;

      return this.search
        .find(
          { is_deleted: false },
          { $text: { $search: keyword } },
          { score: { $meta: 'textScore' } },
        )
        .sort({ ignoredName: { $meta: 'textScore' } })
        .limit(10);
    }

    return this.search
      .find({ is_deleted: false })
      .where(query)
      .sort('registrationPurpose detailedPurpose additionals')
      .select('-memo');
  }

  async getQuotationByIdWithMemos(id: string) {
    const memos = await this.memo.find({ is_deleted: false }).sort('type');
    const quotation = await this.search
      .findOne({ _id: id, is_deleted: false })
      .populate('quotations memo additionals');

    return { quotation, memos };
  }

  async createQuotation(dto: CreateQuotationDto) {
    const quotationExists = await this.checkDuplicate(dto.search);

    if (quotationExists) {
      throw new ConflictException(
        `${dto.search.submissionType} ${dto.search.registrationType} ${dto.search.registrationPurpose} ${dto.search.detailedPurpose}는 이미 존재하는 견적 유형입니다`,
      );
    }

    const keyword = this.createKeyword(dto.search);

    try {
      const search = await this.search.create({
        ...dto.search,
        keyword,
        memo: dto.memos,
      });

      const contents = this.parseContentFromQuotationMapper(
        dto.quotations,
        search._id,
      );

      await this.content.insertMany(contents);

      return search;
    } catch (e: any) {
      let error = { ...e.toJSON() };
      error.message = e.message;

      if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map((val: any) => val.path);
        error = `잘못된 입력값입니다: ${message.join(', ')}`;
      }

      throw new HttpException(error, 400);
    }
  }

  async updateQuotationById(id: string, dto: UpdateQuotationDto) {
    const { search, quotations, memos } = dto;
    await this.search.findByIdAndUpdate(id, { ...search, memo: memos });
    await this.content.deleteMany({
      search: id,
    } as FilterQuery<QuotationContent>);

    const contents = this.parseContentFromQuotationMapper(quotations, id);
    await this.content.insertMany(contents);

    return this.getQuotationByIdWithMemos(id);
  }

  async removeQuotationById(id: string) {
    await this.search.findByIdAndUpdate(id, {
      is_deleted: true,
      deleted_at: __NOW__,
    });
    await this.content.updateMany(
      {
        search: id,
      } as FilterQuery<QuotationContent>,
      { is_deleted: true, deleted_at: __NOW__ },
    );

    return { ok: true };
  }

  private parseContentFromQuotationMapper(
    quotations: QuotationMapper,
    searchId: string,
  ) {
    return Object.values(quotations).map((q) => {
      if (q._id) {
        delete q._id;
      }
      return { ...q, search: searchId };
    });
  }

  private createKeyword = (search: Partial<QuotationSearch>) =>
    Object.values(search).join(' ');

  private checkDuplicate(search: Partial<QuotationSearch>) {
    return this.search.findOne({
      categories: search.categories,
      submissionType: search.submissionType,
      registrationType: search.registrationType,
      registrationPurpose: search.registrationPurpose,
      detailedPurpose: search.detailedPurpose,
    });
  }
}
