import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Faculty extends Document {
  @Prop({ type: UserSchema, required: true })
  basicUserDetails: User;

  @Prop({ required: true })
  designation: string;

  @Prop({ required: true })
  department: string;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
