import { IsEmail, IsString } from 'class-validator';

export class UserLoginBodyDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
