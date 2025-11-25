import { PartialType } from '@nestjs/mapped-types';
import { CreateUpDocDto } from './create-up-doc.dto';

export class UpdateUpDocDto extends PartialType(CreateUpDocDto) {}
