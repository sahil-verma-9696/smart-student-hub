import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })  // adds createdAt & updatedAt automatically
export class Activity extends Document {
  @Prop({ required: true }) // title is mandatory
  title: string;

  @Prop({ required: true }) // type is mandatory
  type: string;

  @Prop()  // description is optional
  desc?: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
