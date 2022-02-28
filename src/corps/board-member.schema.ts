import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type BoardMemberDocument = BoardMember & Document;

@Schema()
export class BoardMember {
  @Prop()
  직책: String;

  @Prop()
  is대표권있음: Boolean;

  @Prop()
  is이사: Boolean;

  @Prop()
  is대표이사: Boolean;

  @Prop()
  is공동대표: Boolean;

  @Prop()
  국적: String;

  @Prop()
  이름: String;

  @Prop()
  생년월일: String;

  @Prop()
  주소: String;

  @Prop()
  임기시작일: Date;
}

export const BoardMemberSchema = SchemaFactory.createForClass(BoardMember);
