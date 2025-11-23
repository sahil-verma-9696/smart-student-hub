// schemas/student.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ type: UserSchema, required: true })
  basicUserDetails: User;

  // Academic Info
  @Prop({ required: true })
  branch: string;

  @Prop({ required: true })
  course: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  semester: number;

  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  studentId: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
