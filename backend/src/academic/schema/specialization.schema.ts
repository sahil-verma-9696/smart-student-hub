import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type SpecializationDocument = Specialization & Document;

@Schema({ timestamps: true })
export class Specialization {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branch: Types.ObjectId;
}

export const SpecializationSchema =
  SchemaFactory.createForClass(Specialization);
