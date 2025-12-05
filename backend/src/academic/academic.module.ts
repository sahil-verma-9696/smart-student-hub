import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Academic, AcademicSchema } from './schema/academic.schema';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Academic.name, schema: AcademicSchema }]),
    forwardRef(() => StudentModule)
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {}
