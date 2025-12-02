import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ACTIVITY_STATUS, ACTIVITY_TYPES } from '../types/enum';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/******************************************
 * Types
 *****************************************/
export type ActivityDocument = HydratedDocument<Activity>;

/******************************************
 * Schema
 *
 *
 *****************************************/
@Schema({
  timestamps: true,
  discriminatorKey: 'activityType',
})
export class Activity {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  student: Types.ObjectId;

  @Prop({
    enum: ACTIVITY_TYPES,
    required: true,
    default: ACTIVITY_TYPES.DEFAULT,
  })
  activityType: ACTIVITY_TYPES;

  @Prop({ enum: ACTIVITY_STATUS, default: ACTIVITY_STATUS.PENDING })
  status: ACTIVITY_STATUS;

  @Prop({ type: [String], default: [] })
  externalLinks?: string[];

  @Prop()
  remarks?: string;

  @Prop({ type: Date, default: Date.now })
  dateStart?: Date;

  @Prop({ type: Date, default: Date.now })
  dateEnd?: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
    default: [],
  })
  attachments?: Types.ObjectId[];

  socialLinks?: [
    {
      platform: string;
      url: string;
    },
  ];

  // @Prop({
  //   type: { type: Types.ObjectId, ref: 'Facutly' },
  //   default: null,
  // })
  // assignFaculty?: Types.ObjectId;

  reviewedBy?: Types.ObjectId[];

  reviewedAt?: Date;

  verifiedBy?: Types.ObjectId;

  verifiedAt?: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
