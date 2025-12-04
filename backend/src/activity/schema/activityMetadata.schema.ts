import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ActivityMetaDataDocument = ActivityMetaData & Document;

export enum AttributeType {
  STRING = 'string',
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  STRING_ARRAY = 'string[]',
  NUMBER_ARRAY = 'number[]',
  FILE = 'file',
  FILE_ARRAY = 'file[]',
  RANGE = 'range',
  OBJECT = 'object',
  OBJECT_ARRAY = 'object[]',
}

@Schema({ timestamps: true })
export class ActivityMetaData {
  @Prop({ required: true })
  attribute_name: string;

  @Prop()
  attribute_description?: string;

  @Prop({
    type: String,
    enum: Object.values(AttributeType),
    required: true,
  })
  attribute_type: AttributeType;

  @Prop({ type: MongooseSchema.Types.Mixed })
  attribute_value?: any;

  @Prop({ type: Boolean, default: false })
  required: boolean;
}

export const ActivityMetaDataSchema =
  SchemaFactory.createForClass(ActivityMetaData);

// Useful indexes
ActivityMetaDataSchema.index({ attribute_name: 1 });
ActivityMetaDataSchema.index({ attribute_type: 1 });
