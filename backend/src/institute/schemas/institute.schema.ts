import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { InstituteType } from 'src/auth/types/auth.enum';

export type InstituteDocument = Institute & Document;

@Schema({ timestamps: true })
export default class Institute {
  @Prop({ required: true })
  institute_name: string;

  @Prop({
    required: true,
    enum: Object.values(InstituteType), // e.g., "private" | "government"
  })
  institute_type: InstituteType;

  @Prop({ required: true, lowercase: true, unique: true })
  official_email: string;

  @Prop({ required: true })
  official_phone: string;

  @Prop({ required: true })
  address_line1: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ required: true })
  is_affiliated: boolean;

  @Prop()
  affiliation_university?: string;

  @Prop()
  affiliation_id?: string;

  @Prop({ default: '' })
  instituteCode?: string;

  @Prop({ default: 0 })
  establishedYear?: number;

  @Prop({ default: '' })
  accreditationStatus?: string;

  // ---- CONTACT INFO ----
  @Prop()
  alternatePhone?: string;

  @Prop({ default: '' })
  website?: string;

  // ---- ADDRESS ----
  @Prop()
  addressLine2?: string;

  @Prop()
  logo?: string;
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);
