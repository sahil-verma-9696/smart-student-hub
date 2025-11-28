import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DefaultDocument = HydratedDocument<DefaultActivity>;
@Schema()
export class DefaultActivity {}

export const DefaultActivitySchema =
  SchemaFactory.createForClass(DefaultActivity);
