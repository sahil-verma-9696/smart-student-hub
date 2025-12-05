import { IsString } from 'class-validator';

export class SpecializationDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  branchId: string;
}
