// Schemas/faculty.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Faculty extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop({
    type: {
      email: { type: String, required: true },
      mobile: { type: String, required: true },
    },
    required: true,
  })
  contactInfo: {
    email: string;
    mobile: string;
  };

  @Prop({ required: true, unique: true })
  facultyId: string;

  @Prop({ required: true })
  designation: string;

  @Prop({ required: true })
  department: string;

  @Prop()
  subjectArea?: string;

  @Prop([
    {
      degree: { type: String, required: true },
      institution: { type: String },
      year: { type: Number },
      proofUrl: { type: String },
    },
  ])
  academicQualifications?: Array<{
    degree: string;
    institution?: string;
    year?: number;
    proofUrl?: string;
  }>;

  @Prop([
    {
      position: { type: String, required: true },
      institution: { type: String, required: true },
      fromYear: { type: Number },
      toYear: { type: Number },
      yearsOfService: { type: Number },
    },
  ])
  experienceDetails?: Array<{
    position: string;
    institution: string;
    fromYear?: number;
    toYear?: number;
    yearsOfService?: number;
  }>;

  @Prop({
    type: {
      official: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
      permanent: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
    },
  })
  address?: {
    official?: any;
    permanent?: any;
  };

  @Prop({
    type: {
      idProofUrl: { type: String, required: true },
      appointmentLetterUrl: { type: String },
      cvUrl: { type: String },
      photoUrl: { type: String },
    },
    required: true,
  })
  documents: {
    idProofUrl: string;
    appointmentLetterUrl?: string;
    cvUrl?: string;
    photoUrl?: string;
  };

  @Prop({
    type: {
      institution: { type: String },
      department: { type: String },
      supervisorName: { type: String },
      supervisorEmail: { type: String },
    },
  })
  affiliationReportingHead?: {
    institution?: string;
    department?: string;
    supervisorName?: string;
    supervisorEmail?: string;
  };
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
