import { PartialType } from '@nestjs/mapped-types';
import { SpecializationDto } from './specialization.dto';

export class UpdateSpecializationDto extends PartialType(SpecializationDto) {}
