import { PartialType } from '@nestjs/mapped-types';
import { SemesterDto } from './semester.dto';

export class UpdateSemesterDto extends PartialType(SemesterDto) {}
