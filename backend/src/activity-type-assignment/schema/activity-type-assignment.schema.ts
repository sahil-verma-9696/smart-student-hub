import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ActivityTypeAssignment{
    @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
    activityTypeId: Types.ObjectId;
    
    //institute to which this activity type assignment belongs for premitive acitivity types instituteId will be null
    @Prop({ type: Types.ObjectId, ref: 'Institute', required: false })
    instituteId: Types.ObjectId;
    
    @Prop({ type: String, enum: ['APPROVED', 'UNDER_REVIEW', 'REJECTED'], default: 'APPROVED' })
    status: string;

    
}

export const ActivityTypeAssignmentSchema = SchemaFactory.createForClass(ActivityTypeAssignment);