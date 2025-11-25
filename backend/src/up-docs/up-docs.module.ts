import { Module } from '@nestjs/common';
import { UpDocsService } from './up-docs.service';
import { UpDocsController } from './up-docs.controller';

@Module({
  controllers: [UpDocsController],
  providers: [UpDocsService],
})
export class UpDocsModule {}
