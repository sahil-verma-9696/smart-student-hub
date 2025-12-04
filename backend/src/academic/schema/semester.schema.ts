import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type SemesterDocument = Semester & Document;

@Schema({ timestamps: true })
export class Semester {
  @Prop({ required: true })
  semNumber: number; // 1-8

  @Prop({ type: Types.ObjectId, ref: 'YearLevel', required: true })
  year: Types.ObjectId;
}
export const SemesterSchema = SchemaFactory.createForClass(Semester);
