import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  basicUserDetails: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Academic' })
  acadmicDetails: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Faculty' })
  assignedFaculty: Types.ObjectId;
  
  @Prop({ type: [Types.ObjectId], default: [],ref:"Activity" })
  activities: Types.ObjectId[];
}

export type StudentDocument = Student & Document;  // 🔥 IMPORTANT!
export const StudentSchema = SchemaFactory.createForClass(Student);
