import { Module } from '@nestjs/common';
import { UpDocsService } from './up-docs.service';
import { UpDocsController } from './up-docs.controller';
import { AttachmentModule } from 'src/attachment/attachment.module';

@Module({
  imports: [AttachmentModule],
  controllers: [UpDocsController],
  providers: [UpDocsService],
})
export class UpDocsModule {}
