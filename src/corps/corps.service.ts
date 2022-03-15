import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Corp, CorpDocument, ICorp } from './corp.schema';

type Result = {
  _id: string;
  corpName: string;
  contact: {
    name: string;
    phone: string;
  };
  boards: [{ name: string; termEnds: string; position: string }];
};

@Injectable()
export class CorpsService {
  constructor(
    @InjectModel(Corp.name)
    private readonly corp: Model<CorpDocument> & ICorp,
  ) {}

  public async getExpiringRepsAndClientsForDate(from: string, days: number) {
    const result: Result[] = await this.corp.getExpiringRepsAndClientsForDate(
      from,
      days,
    );

    return {
      result,
      count: result.length,
    };
  }
}
