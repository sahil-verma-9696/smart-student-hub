import { Module } from '@nestjs/common';
import { MindPioletService } from './mind-piolet.service';
import { MindPioletController } from './mind-piolet.controller';
import { HttpModule } from '@nestjs/axios';
import { StudentModule } from 'src/student/student.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from 'src/activity/schema/activity.schema';

@Module({
  imports: [
    HttpModule,
    StudentModule,
    MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }]),
  ],
  controllers: [MindPioletController],
  providers: [MindPioletService],
  exports: [MindPioletService],
})
export class MindPioletModule { }
