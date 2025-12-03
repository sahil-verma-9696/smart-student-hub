import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { Faculty, FacultySchema } from './schemas/faculty.schema';
import { UserModule } from 'src/user/user.module';
import { AssignmentModule } from 'src/assignment/assignment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
    UserModule,
    AssignmentModule,
  ],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService],
})
export class FacultyModule {}
