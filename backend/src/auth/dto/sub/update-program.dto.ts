import { PartialType } from '@nestjs/mapped-types';
import { ProgramDto } from './program.dto';

export class UpdateProgramDto extends PartialType(ProgramDto) {}
