import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type YearLevelDocument = HydratedDocument<YearLevel>;

@Schema({ timestamps: true })
export class YearLevel {
  @Prop({ required: true })
  year: number;

  @Prop({ type: Types.ObjectId, ref: 'Degree', required: true })
  degree: Types.ObjectId;
}
export const YearLevelSchema = SchemaFactory.createForClass(YearLevel);
