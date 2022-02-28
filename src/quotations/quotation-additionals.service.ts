import { Model } from 'mongoose';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  QuotationAdditional,
  QuotationAdditionalDocument,
} from './quotation-additional.schema';
import { CreateAdditionalDto } from './dto/create-additional.dto';
import { __NOW__ } from 'src/utils/constants';

@Injectable()
export class QuotationAdditionalService {
  constructor(
    @InjectModel(QuotationAdditional.name)
    private readonly additional: Model<QuotationAdditionalDocument>,
  ) {}

  public async getAllAdditionals() {
    const additionals = await this.additional.find({ is_deleted: false });
    return additionals;
  }

  public async getAdditionalById(id: string) {
    const additional = await this.additional.findOne({
      _id: id,
      is_deleted: false,
    });

    if (!additional) {
      throw new NotFoundException(
        `${id}에 해당하는 추가사항을 찾지 못했습니다`,
      );
    }

    return additional;
  }

  public async createAdditional(additionalDto: CreateAdditionalDto) {
    const duplicateAdditional = await this.additional.findOne({
      type: additionalDto.type,
    });

    if (duplicateAdditional) {
      throw new ConflictException(
        `${additionalDto.type} 유형의 추가사항이 이미 존재합니다`,
      );
    }

    const additional = await this.additional.create(additionalDto);
    return additional;
  }

  public async updateAdditionalById(
    id: string,
    dto: Partial<CreateAdditionalDto>,
  ) {
    const additional = await this.getAdditionalById(id);

    if (!additional) {
      throw new NotFoundException(
        `${id}에 해당하는 추가사항을 찾지 못했습니다`,
      );
    }

    const updatedAdditional = await this.additional.findByIdAndUpdate(
      id,
      { ...dto },
      { new: true },
    );

    return updatedAdditional;
  }

  public async removeAdditionalById(id: string) {
    await this.additional.findByIdAndUpdate(id, {
      is_deleted: true,
      deleted_at: __NOW__,
    });

    return { ok: true };
  }
}
