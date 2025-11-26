import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Attachment extends Document {
  @Prop({ required: true })
  assetId: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  versionId: string;

  @Prop({ required: true })
  signature: string;

  @Prop({ required: true })
  format: string;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  resourceType: string;

  @Prop({ required: true })
  bytes: number;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  secureUrl: string;

  @Prop({ required: true })
  folder: string;

  @Prop({ required: true })
  createdAtCloudinary: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  originalFilename: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
