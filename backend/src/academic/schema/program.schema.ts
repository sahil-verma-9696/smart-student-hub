import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type ProgramDocument = HydratedDocument<Program>;

@Schema({ timestamps: true })
export class Program {
  @Prop({ type: String })
  id: string;
  @Prop({ required: true })
  name: string; // UG, PG, Diploma

  @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
  institute: Types.ObjectId;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
