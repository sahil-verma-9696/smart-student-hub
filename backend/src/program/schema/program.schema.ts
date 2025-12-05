import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Program extends Document {
  @Prop({
    type: String,
    enum: ['UG', 'PG', 'Diploma', 'PhD', 'Certification'],
    required: true,
  })
  level: string; // UG, PG etc.

  @Prop({ required: true })
  degree: string; // BTech, BCA, MTech etc.

  @Prop({ default: null })
  branch: string; // CSE, Mechanical, etc. (optional for degrees like BCA, MBA)

  @Prop({ default: null })
  specialization: string; // AI & ML, Cyber Security, or null

  @Prop({ required: true })
  intake: number; // seat count for this specific program

  @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
  instituteId: Types.ObjectId;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
