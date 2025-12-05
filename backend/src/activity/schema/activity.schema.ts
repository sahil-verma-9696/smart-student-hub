import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Attachment } from 'src/attachment/schema/attachment.schema';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {

  // Student who performed this activity
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  // Type of activity (internship, seminar, etc.)
  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  activityTypeId: Types.ObjectId;

  // Activity title (short meaningful text)
  @Prop({ required: true })
  title: string;

  // Optional description (long text)
  @Prop()
  description?: string;

  // Uploaded attachments (certificate, proof, receipts, etc.)
  @Prop({ type: [Types.ObjectId], ref: 'Attachment', default: [] })
  attachments: Types.ObjectId[];
  
  //location of the activity
  @Prop({type:String ,required:true})
    location: string;
  @Prop({type:String})
    locationType?: string;


  // Dynamic fields based on ActivityType.formSchema
  @Prop({ type: Object, default: {} })
  details: Record<string, any>;


    //skills acquired
    

  // Approval Status
  @Prop({ type: String, enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  

  // Submission timestamp
  @Prop({type:Date,required:true,default:()=>new Date()})
  submittedAt: Date;

  //reviewed by
    @Prop({ type: Types.ObjectId, ref: 'Faculty', required: false })
    reviewedBy?: Types.ObjectId;
    @Prop({ type: Date })
    reviewedAt?: Date;


  // Approval Metadata
  @Prop({ type: Types.ObjectId, ref: 'Faculty', required: false })
  approvedBy?: Types.ObjectId;
  @Prop({ type: Date })
  approvedAt?: Date;

  // Rejection Metadata
  @Prop({ type: Types.ObjectId, ref: 'Faculty', required: false })
  rejectedBy?: Types.ObjectId;
  @Prop({ type: Date })
  rejectedAt?: Date;

  // Public visibility toggle
  @Prop({ default: false })
  isPublic: boolean;

  // Skills learned from activity
  @Prop({ type: [String], default: [] })
  skills: string[];

  // Credits awarded for the activity
  @Prop({ type: Number, default: 0 })
  creditsEarned: number;

  // External proof link (optional)
  @Prop()
  externalUrl?: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

// Useful indexes for performance
ActivitySchema.index({ studentId: 1 });
ActivitySchema.index({ activityTypeId: 1 });
ActivitySchema.index({ status: 1 });
