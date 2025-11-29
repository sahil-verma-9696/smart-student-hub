import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AcademicDocument = HydratedDocument<Academic>;

@Schema({ timestamps: true })
export class Academic {
  @Prop({ required: false })
  department?: string;

  @Prop()
  course?: string;

  @Prop()
  year?: number;

  @Prop()
  section?: string;

  @Prop({ type: Number, default: 0 })
  backlogs?: number;

  @Prop({ type: Types.ObjectId, ref: 'Student' })
  student: Types.ObjectId;
}

export const AcademicSchema = SchemaFactory.createForClass(Academic);
