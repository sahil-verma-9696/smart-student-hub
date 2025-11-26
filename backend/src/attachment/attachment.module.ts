import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Attachment, AttachmentSchema } from './schema/attachment.schema';
import { AttachmentController } from './attachment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
  ],
  providers: [AttachmentService],
  exports: [AttachmentService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
