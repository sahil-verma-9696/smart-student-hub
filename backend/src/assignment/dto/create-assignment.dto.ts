import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAssignmentDto {
  @IsMongoId()
  @IsNotEmpty()
  activityId: string | Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  facultyId: string | Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  instituteId: string | Types.ObjectId;
}
