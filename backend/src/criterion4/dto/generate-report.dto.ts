import { IsOptional, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import type { ReportData } from '../interfaces/report-data.interface';

export class GenerateReportDto {
  @IsOptional()
  @IsObject()
  reportData?: ReportData;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsObject()
  options?: {
    departmentName?: string;
    instituteName?: string;
  };
}
