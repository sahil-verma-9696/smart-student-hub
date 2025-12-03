import { Module } from '@nestjs/common';
import { MindPioletService } from './mind-piolet.service';
import { MindPioletController } from './mind-piolet.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MindPioletController],
  providers: [MindPioletService],
})
export class MindPioletModule { }
