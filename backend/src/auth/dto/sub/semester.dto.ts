import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SectionDto } from './section.dto';

export class SemesterDto {
  @IsString()
  id: string;

  @IsNumber()
  semNumber: number;

  @IsString()
  yearId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];
}
