import { Module } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Academic, AcademicSchema } from './schema/academic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Academic.name, schema: AcademicSchema },
    ]),
  ],
  providers: [AcademicService],
  controllers: [AcademicController],
  exports: [AcademicService],
})
export class AcademicModule {}
