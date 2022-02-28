import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Document } from 'mongoose';

export type BranchDocument = Branch & Document;
@Schema()
export class Branch {
  @Prop()
  이름: String;

  @Prop()
  소재지: String;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
