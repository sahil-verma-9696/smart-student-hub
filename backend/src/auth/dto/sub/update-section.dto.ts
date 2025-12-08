import { PartialType } from '@nestjs/mapped-types';
import { SectionDto } from './section.dto';

export class UpdateSectionDto extends PartialType(SectionDto) {}
