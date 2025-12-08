import { IsMongoId, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { Types } from 'mongoose';

export class BulkAssignDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  activityIds: string[] | Types.ObjectId[];

  @IsMongoId()
  @IsNotEmpty()
  facultyId: string | Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  instituteId: string | Types.ObjectId;
}
