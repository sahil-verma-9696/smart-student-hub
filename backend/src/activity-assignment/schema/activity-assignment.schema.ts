import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ActivityAssignment{

    //activity being assigned
    @Prop({ type: Types.ObjectId, ref: 'Activity', unique: true, required: true })
    activityId: Types.ObjectId; 

    //student to whom this activity is assigned
    @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
    studentId: Types.ObjectId; 

    //faculty assigned to review the activity (initially null, assigned later)
    @Prop({ type: Types.ObjectId, ref: 'Faculty', required: false })
    facultyId?: Types.ObjectId; 

    //institute to which this assignment belongs
    @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
    instituteId: Types.ObjectId; 
}

export const ActivityAssignmentSchema = SchemaFactory.createForClass(ActivityAssignment);