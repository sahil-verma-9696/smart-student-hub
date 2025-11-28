import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
    required: true,
  })
  basicUserDetails: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Institute',
    default: null,
    required: true,
  })
  institute: Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
