import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AcademicDocument = HydratedDocument<Academic>;

@Schema({ timestamps: true })
export class Academic {
  @Prop({ type: Types.ObjectId, ref: 'AcademicProgram', required: true })
  program: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Degree', required: true })
  degree: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branch: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Specialization' })
  specialization: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Section' })
  section: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  backlogs?: number;

  @Prop({ type: Types.ObjectId, ref: 'Student' })
  student: Types.ObjectId;
}

export const AcademicSchema = SchemaFactory.createForClass(Academic);
