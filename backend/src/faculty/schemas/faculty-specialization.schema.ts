import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FacultySpecializationDocument = FacultySpecialization & Document;

@Schema({ timestamps: true })
export class FacultySpecialization {
  @Prop({ type: Types.ObjectId, ref: 'Faculty', required: true, unique: true })
  facultyId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  activityTypes: string[]; // e.g., ['Research', 'Internship', 'Competition']

  @Prop({ type: [String], default: [] })
  departments: string[];

  @Prop()
  expertise?: string;

  @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
  instituteId: Types.ObjectId;
}

export const FacultySpecializationSchema = SchemaFactory.createForClass(FacultySpecialization);
