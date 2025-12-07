import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AcademicDocument = HydratedDocument<Academic>;

@Schema({ timestamps: true })
export class Academic {
  @Prop({ type: Types.ObjectId, ref: 'AcademicProgram', default: null })
  program?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Degree', default: null })
  degree?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', default: null })
  branch?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Specialization', default: null })
  specialization: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Section', default: null })
  section: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  backlogs?: number;

  @Prop({ type: Types.ObjectId, ref: 'Student', default: null })
  student: Types.ObjectId;
}

export const AcademicSchema = SchemaFactory.createForClass(Academic);
