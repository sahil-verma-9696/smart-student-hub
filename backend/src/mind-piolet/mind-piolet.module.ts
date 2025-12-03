import { Module } from '@nestjs/common';
import { MindPioletService } from './mind-piolet.service';
import { MindPioletController } from './mind-piolet.controller';

@Module({
  controllers: [MindPioletController],
  providers: [MindPioletService],
})
export class MindPioletModule {}
