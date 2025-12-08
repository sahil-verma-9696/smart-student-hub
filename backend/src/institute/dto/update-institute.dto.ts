import { PartialType } from '@nestjs/mapped-types';
import RegisterInstituteFormDto from '../../auth/dto/create-institute.dto';

export class UpdateInstituteDto extends PartialType(RegisterInstituteFormDto) {}
