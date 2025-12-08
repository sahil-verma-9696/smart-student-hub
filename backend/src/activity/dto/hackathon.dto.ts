import { IsString, IsNumber, IsOptional } from 'class-validator';

export class HackathonDto {
  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @IsOptional()
  @IsString()
  rank?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  participantType?: string;

  @IsOptional()
  @IsString()
  deadline?: Date;

  @IsOptional()
  @IsString()
  organizer?: string;
}
