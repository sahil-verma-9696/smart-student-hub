import { PartialType } from '@nestjs/mapped-types';
import { DegreeDto } from './degree.dto';

export class UpdateDegreeDto extends PartialType(DegreeDto) {}
