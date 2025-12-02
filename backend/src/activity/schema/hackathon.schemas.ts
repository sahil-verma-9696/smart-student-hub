import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HackathonDocument = HydratedDocument<HackathonActivity>;
@Schema()
export class HackathonActivity {
  @Prop()
  teamSize?: number;

  @Prop()
  rank?: string;

  @Prop()
  description?: string;
}

export const HackathonActivitySchema = SchemaFactory.createForClass(HackathonActivity);
