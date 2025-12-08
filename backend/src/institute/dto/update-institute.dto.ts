import { PartialType } from '@nestjs/mapped-types';
import { RegisterInstituteDto } from '../../auth/dto/register-institute.dto';

export class UpdateInstituteDto extends PartialType(RegisterInstituteDto) {}
