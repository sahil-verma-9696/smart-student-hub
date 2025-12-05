import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { Faculty, FacultySchema } from './schemas/faculty.schema';
import { FacultySpecialization, FacultySpecializationSchema } from './schemas/faculty-specialization.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faculty.name, schema: FacultySchema },
      { name: FacultySpecialization.name, schema: FacultySpecializationSchema }
    ]),
    UserModule,
  ],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService],
})
export class FacultyModule {}
