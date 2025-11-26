import { IsObject, IsOptional } from 'class-validator';

export class CustomFieldsDto {
  @IsObject()
  @IsOptional()
  fields?: Record<string, any>;
}
