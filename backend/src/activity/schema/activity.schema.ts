import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ACTIVITY_STATUS, ACTIVITY_TYPES } from '../types/enum';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/******************************************
 * Types
 *****************************************/
export type ActivityDocument = HydratedDocument<Activity>;

/******************************************
 * @description Schema of Activity upload by student
 ******************************************/
@Schema({
  timestamps: true,
  discriminatorKey: 'activityType',
})
export class Activity {
  /******************************************************************
   ************************** Uploaded By STUDENT *********************
   ******************************************************************/
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  student: Types.ObjectId;

  /******************************************************************
   ************************** Basic Information *********************
   ******************************************************************/
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  /************************ New ************************************ */
  @Prop({ type: [String], default: [] })
  skills?: string[];

  @Prop({
    enum: ACTIVITY_TYPES,
    required: true,
    default: ACTIVITY_TYPES.DEFAULT,
  })
  activityType: ACTIVITY_TYPES;

  /******************************************************************
   ************************** Dates ************************************
   ******************************************************************/
  @Prop({ type: Date, default: Date.now })
  dateStart?: Date;

  @Prop({ type: Date, default: Date.now })
  dateEnd?: Date;

  /******************************************************************
   ******************* Uploaded Activity Verification Status ************************************
   ******************************************************************/
  @Prop({ enum: ACTIVITY_STATUS, default: ACTIVITY_STATUS.PENDING })
  status: ACTIVITY_STATUS;

  @Prop({
    type: { type: Types.ObjectId, ref: 'Facutly' },
  })
  approvedBy?: Types.ObjectId;

  /************************ New ************************************ */
  @Prop({ type: Date })
  approved_at?: Date;

  /************************ New ************************************ */
  @Prop({ type: String })
  approved_message?: string;

  /************************ New ************************************ */
  @Prop({
    type: { type: Types.ObjectId, ref: 'Facutly' },
  })
  rejectedBy?: Types.ObjectId;

  /************************ New ************************************ */
  @Prop({ type: Date })
  rejected_at?: Date;

  /************************ New ************************************ */
  @Prop({ type: String })
  rejected_message?: string;

  /******************************************************************
   ************************** Credits (NEW) **************************
   ******************************************************************/
  @Prop({ type: Number })
  credits_earned?: number;

  /******************************************************************
   ************************** Attachments **************************
   ******************************************************************/
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
    default: [],
  })
  attachments?: Types.ObjectId[];

  @Prop({
    type: [
      {
        platform: String,
        url: String,
      },
    ],
    default: [],
  })
  socialLinks?: [
    {
      platform: string;
      url: string;
    },
  ];

  /******************************************************************
   ************************** LEGACY **************************
   ******************************************************************/
  @Prop()
  remarks?: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
