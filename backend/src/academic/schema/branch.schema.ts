import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Degree', required: true })
  degree: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
