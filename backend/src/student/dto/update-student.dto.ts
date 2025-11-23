import { PartialType } from '@nestjs/mapped-types';
import { CreateBasicStudentDto } from './create-basic-student.dto';

export class UpdateStudentDto extends PartialType(CreateBasicStudentDto) {}
