import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FacultyDocument = Faculty & Document;

@Schema({ timestamps: true })
export class Faculty {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
    required: true,
  })
  basicUserDetails: Types.ObjectId;

  designation: string;

  department: string;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
