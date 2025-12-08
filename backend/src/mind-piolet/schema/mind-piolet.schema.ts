import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Student } from '../../student/schema/student.schema';

export type MindPioletDocument = MindPiolet & Document;

@Schema({ timestamps: true })
export class MindPiolet {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: Student;

  @Prop({ required: true, enum: ['SKILL', 'ROADMAP', 'INTERVIEW'] })
  type: string;

  @Prop()
  role?: string;

  @Prop({ type: Object })
  metadata: any; // Stores conversation history or specific inputs

  @Prop({ required: true })
  response: string;
}

export const MindPioletSchema = SchemaFactory.createForClass(MindPiolet);
