import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import CreateInstituteDto from 'src/institute/dto/create-institute.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';

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
