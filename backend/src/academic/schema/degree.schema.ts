import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type DegreeDocument = HydratedDocument<Degree>;

@Schema({ timestamps: true })
export class Degree {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'AcademicProgram', required: true })
  program: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
  institute: Types.ObjectId;
}

export const DegreeSchema = SchemaFactory.createForClass(Degree);
