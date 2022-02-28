import { Model } from 'mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuotationMemo, QuotationMemoDocument } from './quotation-memo.schema';
import { CreateMemoDto } from './dto/create-memo.dto';
import { __NOW__ } from 'src/utils/constants';

@Injectable()
export class QuotationMemosService {
  constructor(
    @InjectModel(QuotationMemo.name)
    private readonly memo: Model<QuotationMemoDocument>,
  ) {}

  public async getAllMemos() {
    const memos = await this.memo.find({ is_deleted: false });
    return memos;
  }

  public async getMemoById(id: string) {
    const memo = await this.memo.findOne({ _id: id, is_deleted: false });

    if (!memo) {
      throw new NotFoundException(`${id}에 해당하는 메모를 찾지 못했습니다`);
    }

    return memo;
  }

  public async createNewMemo(memoDto: CreateMemoDto) {
    const isDuplicate = await this.memo.findOne({
      type: memoDto.type,
      is_deleted: false,
    });

    if (isDuplicate) {
      throw new ConflictException(
        `${memoDto.type}에 해당하는 메모가 이미 존재합니다`,
      );
    }

    const memo = await this.memo.create(memoDto);
    return memo;
  }

  public async updateMemoById(id: string, memoDto: Partial<CreateMemoDto>) {
    const memo = await this.getMemoById(id);

    if (!memo) {
      throw new NotFoundException(`${id}에 해당하는 메모를 찾지 못했습니다`);
    }

    const updatedMemo = await this.memo.findByIdAndUpdate(
      id,
      { ...memoDto },
      { new: true },
    );

    return updatedMemo;
  }

  public async removeMemoById(id: string) {
    await this.memo.findByIdAndUpdate(id, {
      is_deleted: true,
      deleted_at: __NOW__,
    });

    return { ok: true };
  }
}
