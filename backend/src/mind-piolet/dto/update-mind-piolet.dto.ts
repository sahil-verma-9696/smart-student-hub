import { PartialType } from '@nestjs/mapped-types';
import { CreateMindPioletDto } from './create-mind-piolet.dto';

export class UpdateMindPioletDto extends PartialType(CreateMindPioletDto) {}
