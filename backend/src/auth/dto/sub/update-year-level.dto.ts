import { PartialType } from '@nestjs/mapped-types';
import { YearLevelDto } from './year-level.dto';

export class UpdateYearLevelDto extends PartialType(YearLevelDto) {}
