import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

/**
 * Assignment schema - simple mapping of Activity to Faculty
 * - Each activity can only be assigned to one faculty (activityId is unique)
 * - A faculty can have multiple activities assigned
 */
@Schema({ timestamps: true })
export class Assignment {
    @Prop({ type: Types.ObjectId, ref: 'Activity', required: true, unique: true })
    activityId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Faculty', required: true })
    facultyId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Institute', required: true })
    instituteId: Types.ObjectId;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);

// Index on facultyId for efficient "get all activities by faculty" queries
AssignmentSchema.index({ facultyId: 1 });
AssignmentSchema.index({ instituteId: 1 });
