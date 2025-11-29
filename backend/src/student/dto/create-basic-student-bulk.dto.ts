import { IsBooleanString, IsOptional } from 'class-validator';

export class BulkStudentUploadQueryDto {
  @IsBooleanString()
  @IsOptional()
  bulk?: string; // ?bulk=true
}
