import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true })
  name: string; // e.g., Computer Science Dept.

  @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
  institute: Types.ObjectId;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
