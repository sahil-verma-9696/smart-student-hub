import {
  // IsEnum,
  IsString,
} from 'class-validator';

export class CreateBasicStudentDto {
  @IsString()
  institute: string;
}
