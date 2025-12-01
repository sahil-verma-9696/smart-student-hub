import {
  IsBooleanString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateStudentWithoutInstitueIdDto } from './create-basic-student.dto';
import { Type } from 'class-transformer';

export class BulkStudentUploadQueryDto {
  @IsBooleanString()
  @IsOptional()
  bulk?: string; // ?bulk=true
}

export class BulkCreateStudentDto {
  @IsString()
  instituteId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateStudentWithoutInstitueIdDto)
  students: CreateStudentWithoutInstitueIdDto[];
}
