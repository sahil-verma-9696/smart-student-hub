import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InstituteType } from 'src/auth/types/auth.enum';

@Schema({ timestamps: true })
export default class Institute extends Document {
  @Prop({ required: true })
  institute_name: string;

  @Prop({
    required: true,
    enum: Object.values(InstituteType),
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

  // 🔥 New field: All programs offered by this institute
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Program' }], default: [] })
  programs: Types.ObjectId[];
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);
