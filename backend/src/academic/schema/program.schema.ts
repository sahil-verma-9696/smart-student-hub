import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ProgramDocument = Program & Document;

@Schema({ timestamps: true })
export class Program {
  @Prop({ required: true })
  name: string; // UG, PG, Diploma

  @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
  institute: Types.ObjectId;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
