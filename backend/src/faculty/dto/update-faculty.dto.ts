// dto/update-faculty.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateFacultyAdminDto } from './create-faculty-admin.dto';

export class UpdateFacultyDto extends PartialType(CreateFacultyAdminDto) {}
