import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Academic, AcademicSchema } from './schema/academic.schema';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Academic.name, schema: AcademicSchema }]),
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {}
