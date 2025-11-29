import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherDetailsDto } from '../dto/other-detail.dto';

@Schema({ timestamps: true })
export class Faculty extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  basicUserDetails: Types.ObjectId;
  @Prop({  type: [Types.ObjectId], default: [],ref:"Student"})
  assignedStudent: Types.ObjectId[];
  @Prop({ type: OtherDetailsDto, required: false })
    otherDetails: OtherDetailsDto;
  @Prop()
  department:string;
  @Prop()
  designation:string;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
