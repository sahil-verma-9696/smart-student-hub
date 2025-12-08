import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MindPioletService } from './mind-piolet.service';
import { MindPioletController } from './mind-piolet.controller';
import { MindPiolet, MindPioletSchema } from './schema/mind-piolet.schema';
import { StudentModule } from '../student/student.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MindPiolet.name, schema: MindPioletSchema },
    ]),
    StudentModule,
    ConfigModule,
  ],
  controllers: [MindPioletController],
  providers: [MindPioletService],
  exports: [MindPioletService],
})
export class MindPioletModule {}
