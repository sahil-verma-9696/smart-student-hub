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

  @Prop({
    type: Types.ObjectId,
    ref: 'Institute',
    default: null,
    required: false,
  })
  institute: Types.ObjectId;

  @Prop({
    type: String,
    default: '',
    required: true,
    unique: true,
  })
  employee_code: string;

  @Prop({
    type: String,
    default: '',
    required: false,
  })
  department: string;

  @Prop({
    type: String,
    default: '',
    required: false,
  })
  designation: string;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
