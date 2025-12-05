import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SemesterDocument = HydratedDocument<Semester>;

@Schema({ timestamps: true })
export class Semester {
  @Prop({ required: true })
  semNumber: number; // 1-8

  @Prop({ type: Types.ObjectId, ref: 'YearLevel', required: true })
  year: Types.ObjectId;
}
export const SemesterSchema = SchemaFactory.createForClass(Semester);
