import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WorkshopDocument = HydratedDocument<WorkshopActivity>;
@Schema()
export class WorkshopActivity {
  @Prop({ required: true })
  workshopName: string;

  @Prop()
  speaker?: string;

  @Prop()
  organizer?: string;

  @Prop()
  duration?: string;

  @Prop()
  location?: string;
}

export const WorkshopActivitySchema = SchemaFactory.createForClass(WorkshopActivity);
