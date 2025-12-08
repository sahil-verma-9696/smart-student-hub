import { IsString, IsNumber } from 'class-validator';

export class SectionDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  seatCapacity: number;

  @IsString()
  specializationId: string;

  @IsString()
  semesterId: string;
}
