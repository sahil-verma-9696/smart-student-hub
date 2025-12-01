// schemas/student.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
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
    type: Types.ObjectId,
    ref: 'Academic',
    default: null,
    required: false,
  })
  academicDetails: Types.ObjectId;

  @Prop({ required: true, unique: true })
  roll_number: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
