import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type SectionDocument = Section & Document;

@Schema({ timestamps: true })
export class Section {
  @Prop({ required: true })
  name: string; // A, B, C

  @Prop({ required: true })
  seatCapacity: number;

  @Prop({ type: Types.ObjectId, ref: 'Specialization', required: true })
  specialization: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Semester', required: true })
  semester: Types.ObjectId;
}
export const SectionSchema = SchemaFactory.createForClass(Section);
