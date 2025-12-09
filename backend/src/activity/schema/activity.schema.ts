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
    type: String,
    required: true,
    default: ACTIVITY_TYPES.DEFAULT,
  })
  activityType: string;

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
