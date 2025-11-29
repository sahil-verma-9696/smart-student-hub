import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAcademicDto {
  @IsString()
  @IsNotEmpty()
  branch: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  universityId: string;

  @IsString()
  @IsNotEmpty()
  course: string;
}
