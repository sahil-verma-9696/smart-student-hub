import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class ReassignActivityDto {
  @IsMongoId()
  @IsNotEmpty()
  activityId: string | Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  newFacultyId: string | Types.ObjectId;
}
