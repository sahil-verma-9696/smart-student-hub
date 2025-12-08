import { IsNotEmpty, IsString } from 'class-validator';

export class RejectActivityDto {
  @IsNotEmpty({ message: 'Remarks are required when rejecting an activity' })
  @IsString()
  remarks: string;
}
