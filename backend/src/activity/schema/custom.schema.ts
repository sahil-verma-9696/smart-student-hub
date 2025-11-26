import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomActivityDocument = HydratedDocument<CustomActivity>;
@Schema()
export class CustomActivity {
  @Prop({ type: Object, default: {} })
  fields: Record<string, any>;
}

export const CustomActivitySchema = SchemaFactory.createForClass(CustomActivity);
