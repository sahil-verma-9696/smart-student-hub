import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ACTIVITY_VERIFICATION_STATUS } from '../types/enum';

export type ActivityTypeDocument = ActivityType & Document;

export enum VerificationLevel {
  AUTO = 'auto',
  FACULTY = 'faculty',
  ADMIN = 'admin',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ActivityType {
  /******************************************************************
   ************************** Basic Information *********************
   ******************************************************************/
  // add in future
  //   @Prop({ type: String, unique: true, sparse: true })
  //   typeCode?: string;

  @Prop({ required: true, maxlength: 255 })
  typeName: string;

  @Prop()
  description?: string;

  /******************************************************************
   ************************** Credits *********************
   ******************************************************************/
  @Prop({ type: Number })
  maxCredits?: number;

  @Prop({ type: Number })
  minCredits?: number;

  @Prop({ type: Boolean, default: true })
  requiresProof: boolean;

  @Prop({ type: [String], default: [] })
  proofTypes?: string[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  /******************************************************************
   ************************** Activity verification status (NEW) **************************
   ******************************************************************/
  @Prop({
    enum: ACTIVITY_VERIFICATION_STATUS,
    default: ACTIVITY_VERIFICATION_STATUS.DRAFT,
  })
  status: ACTIVITY_VERIFICATION_STATUS;

  @Prop({ type: Date })
  submitted_at?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  submitted_by?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  verified_by?: Types.ObjectId;

  @Prop({ type: Date })
  verified_at?: Date;

  @Prop({ type: String })
  verificatiomessage?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejected_by?: Types.ObjectId;

  @Prop({ type: Date })
  rejected_at?: Date;

  @Prop({ type: String })
  rejectiomessage?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  // createdAt handled by timestamps
}

export const ActivityTypeSchema = SchemaFactory.createForClass(ActivityType);

// Indexes similar to SQL
ActivityTypeSchema.index({ typeCode: 1 }, { unique: true, sparse: true });
ActivityTypeSchema.index({ categoryId: 1 });
ActivityTypeSchema.index({ isActive: 1 });
