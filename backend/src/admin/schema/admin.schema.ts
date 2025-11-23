import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
    required: true,
  })
  basicUserDetails: Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
