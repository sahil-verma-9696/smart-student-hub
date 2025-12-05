import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { InstituteDocument } from 'src/institute/schemas/institute.schema';
import { UserDocument } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Admin {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  basicUserDetails:
    | mongoose.Types.ObjectId
    | mongoose.PopulatedDoc<UserDocument>;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Institute', required: false })
  institute?:
    | mongoose.Types.ObjectId
    | mongoose.PopulatedDoc<InstituteDocument>;
}

export type AdminDocument = mongoose.HydratedDocument<Admin>;
export const AdminSchema = SchemaFactory.createForClass(Admin);
