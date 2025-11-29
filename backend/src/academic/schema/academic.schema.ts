import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })  // optional: adds createdAt & updatedAt
export class Academic extends Document {
  @Prop({required:false})
  branch: string;

  @Prop({ required: true })
  year: number;  // change to string if like "3rd Year"

  @Prop({ required: true })
  section: string;

  @Prop({ required: false})
  universityId: string;

  @Prop({ required: true })
  course: string;

  @Prop({ required: true })
  semester: string;

  @Prop({required:false})
  studentId: Types.ObjectId;  // reference to Student document
}

export const AcademicSchema = SchemaFactory.createForClass(Academic);
