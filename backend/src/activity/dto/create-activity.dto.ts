import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateActivityDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title: string;

  @IsString({ message: 'Type must be a string' })
  @IsNotEmpty({ message: 'Type is required' })
  type: string;

  @IsString({ message: 'Description must be a string' })
  desc?: string;  // optional
}
