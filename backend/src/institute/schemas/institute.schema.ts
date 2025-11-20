import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { InstituteType } from 'src/auth/types/auth.enum';

export type InstituteDocument = HydratedDocument<Institute>;

@Schema()
export class Institute {
  @Prop({ required: true })
  name: string;

  @Prop()
  isAffiliated: boolean;

  @Prop()
  affiliation: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop({ required: true, default: InstituteType.Private })
  type: InstituteType;
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);
