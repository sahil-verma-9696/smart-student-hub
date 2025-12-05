import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


// defining form field schema
@Schema()
export class FormField {

    //field to store key name in details object
    @Prop({ required: true ,Type:String})
    key:string;

    //field label
    @Prop({ required: true })
    label: string;

    //field type
    @Prop({ required: true, enum: ['text', 'number', 'date', 'select', 'checkbox'] })
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox';

    //options for select and checkbox types
    @Prop({ type: [String], default: [] })
    options?: string[]; // for select and checkbox types

    //required or not
    @Prop({ type: Boolean, default: false })
    required?: boolean;

    //placeholder
    @Prop()
    placeholder?: string;
}



@Schema({ timestamps: true })
export class ActivityType {
  @Prop({ required: true })
  name: string;

  //belongs to every institute
  @Prop({type:Boolean, default: false})
  isPrimitive:boolean;

  //instituteId to which this activity type belongs if not primitive
  @Prop({ type: Types.ObjectId, ref: 'Institute', required: false })
  instituteId?: Types.ObjectId;
  
  //description of activity type
    @Prop()
    description?: string;

    //status of activity type (i.e draft or approved or rejected or submitted or underReview
    @Prop({ type: String, enum: ['DRAFT', 'APPROVED', 'REJECTED', 'SUBMITTED', 'UNDER_REVIEW'], default: 'DRAFT' })
    status: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'UNDER_REVIEW';

    //formSchema to hold dynamic fields as embedded subdocuments
    @Prop({ type: [FormField], default: [] })
    formSchema: FormField[];

    // minimum credits allowed for this activity type
    @Prop({ type: Number, required: false, default: 0 })
    minCredit?: number;

    // maximum credits allowed for this activity type
    @Prop({ type: Number, required: false, default: 0 })
    maxCredit?: number;

}

export const ActivityTypeSchema = SchemaFactory.createForClass(ActivityType);

// Indexes for efficient querying
ActivityTypeSchema.index({ instituteId: 1 }); // Query by institute
ActivityTypeSchema.index({ isPrimitive: 1 }); // Query primitive types
ActivityTypeSchema.index({ status: 1 }); // Query by status
ActivityTypeSchema.index({ instituteId: 1, status: 1 }); // Compound index for common queries