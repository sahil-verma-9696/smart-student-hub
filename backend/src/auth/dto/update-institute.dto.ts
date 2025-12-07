import { PartialType } from '@nestjs/mapped-types';
import CreateInstituteDto from 'src/institute/dto/create-institute.dto';

export class UpdateInstituteDto extends PartialType(CreateInstituteDto) {}
