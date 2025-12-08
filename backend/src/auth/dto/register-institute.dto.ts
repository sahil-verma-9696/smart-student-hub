import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import CreateInstituteDto from 'src/institute/dto/create-institute.dto';

export class RegisterInstituteDto {
  // ---------------- INSTITUTE DETAILS ----------------
  @IsObject()
  @ValidateNested()
  @Type(() => CreateInstituteDto) 
  institute: CreateInstituteDto;

  // ---------------- ADMIN DETAILS ----------------
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAdminDto)
  admin: CreateAdminDto;
}
