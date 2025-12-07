import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Attachment } from 'src/attachment/schema/attachment.schema';
import { InstituteType } from 'src/auth/types/auth.enum';

export type InstituteDocument = Institute & Document;

@Schema({ timestamps: true })
export default class Institute {
  // ---------------- BASIC DETAILS ----------------
  @Prop({ required: true })
  institute_name: string;

  @Prop({
    required: true,
    enum: Object.values(InstituteType), // "private" | "government"
  })
  institute_type: InstituteType;

  @Prop({ required: true, lowercase: true, unique: true })
  official_email: string;

  @Prop({ required: true })
  official_phone: string;

  // ---------------- ADDRESS ----------------
  @Prop({ required: true, default: '' })
  address_line1: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  pincode: string;

  @Prop()
  addressLine2?: string;

  // ---------------- AFFILIATION ----------------
  @Prop()
  affiliation_university?: string;

  @Prop()
  affiliation_id?: string;

  // ---------------- INSTITUTE META ----------------
  @Prop({ default: '' })
  instituteCode?: string; // Auto-generated: INST0, INST1, INST2...

  @Prop({ default: 0 })
  establishedYear?: number;

  @Prop({ default: '' })
  accreditationStatus?: string;

  // ---------------- CONTACT ----------------
  @Prop()
  alternatePhone?: string;

  @Prop({ default: '' })
  website?: string;

  // ---------------- LOGO ----------------
  // @Prop({ type: Types.ObjectId, ref: 'Attachment', default: null })
  // logo?: Attachment;

  @Prop({ type: String })
  logo?: string;
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);

/**
 * PRE-SAVE HOOK
 * -------------------------------------------------
 * Automatically generates an institute code:
 *
 * 1. First institute  → INST0
 * 2. Next institute   → INST1
 * 3. Next institute   → INST2
 *
 * Logic:
 * - Fetch the most recently created institute
 * - Extract its numeric suffix (e.g. INST5 → 5)
 * - Increment and assign new code
 */

InstituteSchema.pre('save', async function (next) {
  try {
    // If updating an existing document, do NOT overwrite instituteCode
    if (this.instituteCode) return next();

    // Access the Institute model
    const InstituteModel = this.model('Institute');

    // Fetch the last created institute and convert to plain object
    const lastInstitute = await InstituteModel.findOne()
      .sort({ createdAt: -1 })
      .lean<Institute>(); // Type-safe lean()

    let nextNumber = 0; // Default code for first institute = INST0

    // If a previous institute exists, extract its numeric suffix
    if (lastInstitute?.instituteCode) {
      const lastNum = parseInt(
        lastInstitute.instituteCode.replace('INST', ''),
        10,
      );

      nextNumber = lastNum + 1;
    }

    // Assign the new auto-generated code
    this.instituteCode = `INST${nextNumber}`;

    next();
  } catch (error) {
    next(error);
  }
});
