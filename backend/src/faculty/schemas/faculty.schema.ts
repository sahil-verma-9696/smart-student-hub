import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherDetailsDto } from '../dto/other-detail.dto';

@Schema({ timestamps: true })
export class Faculty extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  basicUserDetails: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], default: [], ref: "Student" })
  assignedStudent: Types.ObjectId[];

  @Prop({ type: OtherDetailsDto, required: false })
  otherDetails: OtherDetailsDto;

  @Prop()
  department: string;

  @Prop()
  designation: string;

  @Prop({ type: [String], default: [] })
  specializations: string[]; // Activity types faculty can verify (e.g., 'Research', 'Internship')

  @Prop()
  expertise?: string; // Additional expertise description

  @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
  instituteId: Types.ObjectId;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);

// Indexes
FacultySchema.index({ basicUserDetails: 1 }, { unique: true }); // Each user can have only one faculty profile
FacultySchema.index({ instituteId: 1 }); // Query by institute
