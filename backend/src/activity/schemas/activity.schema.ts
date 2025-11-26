import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true })
  studentId: string;

  @Prop({
    required: true,
    enum: [
      'MOOC',
      'CERTIFICATION',
      'CONFERENCE',
      'CONFERENCE_PAPER',
      'WORKSHOP',
      'WEBINAR',
      'COMPETITION',
      'INTERNSHIP',
      'LEADERSHIP',
      'VOLUNTEERING',
      'CLUB_ACTIVITY',
      'PROJECT',
      'SPORTS',
      'CULTURAL',
      'RESEARCH',
      'PATENT',
      'OTHER',
    ],
  })
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop() description?: string;

  @Prop() dateStart?: Date;

  @Prop() dateEnd?: Date;

  @Prop({
    required: true,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  verificationStatus: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  approved_by?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  rejected_by?: string;

  @Prop() rejectionReason?: string;

  @Prop({ type: Object, required: true })
  details: Record<string, any>;

  @Prop({ type: [String], default: [] })
  certificateUrls?: string[];

  @Prop({ type: [String], default: [] })
  mediaUrls?: string[];

  @Prop() level?: string;

  @Prop() hoursCount?: number;

  @Prop({ type: [String] })
  tags?: string[];
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
