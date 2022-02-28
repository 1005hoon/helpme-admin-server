import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DateParser } from 'src/utils/date-parser';
import { BoardMember } from './board-member.schema';
import { Branch } from './branch.schema';

export interface ICorp {
  getExpiringRepsAndClientsForDate: Function;
}
export type CorpDocument = Corp & Document;

@Schema()
export class Corp {
  @Prop(
    raw({
      corpGroupSeq: Number,
      searchTags: [String],
      settlingDay: String,
    }),
  )
  meta: Record<string, any>;

  @Prop(
    raw({
      inRaw: { text: String },
      aliases: [String],
      inKorean: {
        text: String,
        prefixed: Boolean,
      },
      inRoman: {
        text: String,
        entity: String,
      },
    }),
  )
  name: Record<string, any>;

  @Prop(
    raw({
      pnu: Boolean,
      소재지: String,
    }),
  )
  본점: Record<string, any>;

  @Prop()
  seq: number;

  @Prop()
  isMigratedToYard?: Boolean;

  @Prop(
    raw({
      이름: { type: String },
      전화번호: { type: String },
      이메일주소: { type: String },
    }),
  )
  담당자: Record<string, string>;

  @Prop()
  임원s: [BoardMember];

  @Prop()
  지점s: [Branch];

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop()
  type: String;

  @Prop()
  이사수: Number;

  @Prop()
  자본금: Number;

  @Prop({ type: Date })
  회사성립연월일: Date;
}

export const CorpSchema = SchemaFactory.createForClass(Corp);

CorpSchema.statics.getExpiringRepsAndClientsForDate = function (
  from: string,
  days: number,
) {
  const queryFrom = DateParser.getStartOfDay(from);
  const queryTo = DateParser.getStartOfNextDay(queryFrom, days ? days : 1);

  return this.aggregate([
    {
      $match: {
        tags: { $nin: [/sc/, /SC/] },
        type: { $ne: '유한회사' },
      },
    },
    {
      $addFields: {
        corpname: {
          $cond: {
            if: { $eq: ['$name.inKorean.prefixed', true] },
            then: { $concat: ['$type', ' ', '$name.inKorean.text'] },
            else: { $concat: ['$name.inKorean.text', ' ', '$type'] },
          },
        },
      },
    },
    // 헬프미에서 등기 진행여부 확인 (세금계산서 발행 완료 법인 기준)
    {
      $lookup: {
        from: 'taskcards',
        localField: '_id',
        foreignField: 'ref.corp',
        as: 'taskcard',
      },
    },
    {
      $unwind: {
        path: '$taskcard',
      },
    },
    {
      $match: {
        'taskcard.title': '세금계산서 발행하기',
        'taskcard.checked': true,
      },
    },
    // taskcard로 풀어진거 뭉치기
    {
      $group: {
        _id: '$_id',
        searchTag: { $first: '$meta.searchTags' },
        corpName: { $first: '$corpname' },
        boards: { $first: '$임원s' },
        client: { $first: '$담당자' },
      },
    },
    // 임기만료 일자 추가, aliasing 처리, 임원 펼치기
    {
      $unwind: {
        path: '$boards',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        corpName: 1,
        searchTag: 1,
        contact: {
          name: '$client.이름',
          phone: '$client.전화번호',
        },
        board: {
          name: '$boards.이름',
          termFrom: '$boards.임기시작일',
          termEnds: {
            $dateFromParts: {
              year: { $add: [{ $year: '$boards.임기시작일' }, 3] },
              month: {
                $month: {
                  $cond: {
                    if: { $eq: ['$boards.직책', '감사'] },
                    then: new Date('2021-03-31'),
                    else: '$boards.임기시작일',
                  },
                },
              },
              day: {
                $dayOfMonth: {
                  $cond: {
                    if: { $eq: ['$boards.직책', '감사'] },
                    then: new Date('2021-03-31'),
                    else: '$boards.임기시작일',
                  },
                },
              },
            },
          },
          isExecutive: '$boards.이사',
          position: '$boards.직책',
        },
      },
    },
    // 남은 일자수로 필터
    {
      $match: {
        'board.termEnds': {
          $gte: queryFrom,
          $lt: queryTo,
        },
      },
    },
    // 법인별로 합치기
    {
      $group: {
        _id: '$_id',
        corpName: { $first: '$corpName' },
        searchTag: { $first: '$searchTag' },
        contact: { $first: '$contact' },
        boards: { $push: '$board' },
      },
    },
  ]);
};
