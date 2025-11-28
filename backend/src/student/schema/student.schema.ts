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

  // Academic Info
  // @Prop({ required: true })
  branch: string;

  // @Prop({ required: true })
  course: string;

  // @Prop({ required: true })
  year: number;

  // @Prop({ required: true })
  semester: number;

  // @Prop({ required: true })
  section: string;

  // @Prop({ required: true })
  // studentId: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
