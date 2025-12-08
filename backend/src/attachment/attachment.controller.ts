import { Body, Controller, Post } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { AttachmentService } from './attachment.service';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}
  @Post('upload')
  upload(@Body() body: CreateAttachmentDto) {
    return this.attachmentService.upload(body);
  }
}
