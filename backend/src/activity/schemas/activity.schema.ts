import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  JournalPaperDetails,
  ConferencePaperDetails,
  OnlineCourseDetails,
  WorkshopSeminarDetails,
  AchievementAwardDetails,
  CertificationDetails,
} from './activity-details.schemas';

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true })
  activityId: string;

  @Prop({ required: true })
  studentId: string;

  @Prop({
    required: true,
    enum: [
      'JournalPaper',
      'ConferencePaper',
      'OnlineCourse',
      'WorkshopSeminar',
      'AchievementAward',
      'Certification',
    ],
  })
  activityType: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  dateStart: Date;

  @Prop()
  dateEnd: Date;

  @Prop({
    enum: [
      'Completed',
      'Ongoing',
      'Published',
      'Submitted',
      'Won',
      'Participated',
    ],
    default: 'Completed',
  })
  status: string;

  @Prop()
  certificateUrl: string;

  @Prop()
  documentUrl: string;

  @Prop()
  remarks: string;

  // Dynamic details object
  @Prop({ type: Object })
  details:
    | JournalPaperDetails
    | ConferencePaperDetails
    | OnlineCourseDetails
    | WorkshopSeminarDetails
    | AchievementAwardDetails
    | CertificationDetails;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
