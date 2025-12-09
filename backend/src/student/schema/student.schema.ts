// schemas/student.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AcademicDocument } from 'src/academic/schema/academic.schema';
import { InstituteDocument } from 'src/institute/schemas/institute.schema';
import { UserDocument } from 'src/user/schema/user.schema';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
    required: true,
  })
  basicUserDetails: Types.ObjectId | UserDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'Institute',
    default: null,
    required: false,
  })
  institute: Types.ObjectId | InstituteDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'Academic',
    default: null,
    required: false,
  })
  academicDetails: Types.ObjectId | AcademicDocument;

  @Prop({ required: true })
  roll_number: string;

  // --- Mind Pilot Fields ---
  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop({ type: [{ title: String, description: String }], default: [] })
  projects: { title: string; description: string }[];

  @Prop({ type: [String], default: [] })
  achievements: string[];

  @Prop({ type: [String], default: [] })
  strengths: string[];

  @Prop({ type: [String], default: [] })
  weaknesses: string[];

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop({ default: 'Fresher' })
  experience: string;

  @Prop({ default: 'Software Engineer' })
  target_role: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
