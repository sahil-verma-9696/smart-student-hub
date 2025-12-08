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
  level?: string;

  @Prop()
  participantType?: string;

  @Prop({ type: Date, default: Date.now })
  deadline?: Date;

  @Prop()
  organizer?: string;
}

export const HackathonActivitySchema =
  SchemaFactory.createForClass(HackathonActivity);
