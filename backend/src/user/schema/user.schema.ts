import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ContactInfoDto } from '../dto/contact-info.dto';
import { USER_ROLE } from '../types/enum';

export interface UserMethods {
  comparePassword(plainPassword: string): Promise<boolean>;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: USER_ROLE })
  role: string;

  @Prop({ enum: ['male', 'female', 'other'], required: true })
  gender: string;

  @Prop({ type: ContactInfoDto, required: true })
  contactInfo: ContactInfoDto;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 🔐 Hash password before save
UserSchema.pre<User & Document>('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// 🔐 Compare Password Method
UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  plainPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

export type UserDocument = User & Document & UserMethods;
