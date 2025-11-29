import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { Program, ProgramSchema } from './schema/program.schema';
import Institute, { InstituteSchema } from 'src/institute/schemas/institute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Program.name, schema: ProgramSchema },
      { name: Institute.name, schema: InstituteSchema },
    ]),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [ProgramService],
})
export class ProgramModule {}
