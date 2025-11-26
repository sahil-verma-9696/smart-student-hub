import { PartialType } from '@nestjs/mapped-types';
import { CreateAttachmentDto } from 'src/attachment/dto/create-attachment.dto';

export class CreateUpDocDto extends PartialType(CreateAttachmentDto) {}
