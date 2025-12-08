import { Module } from '@nestjs/common';
import { AcadmicProgramService } from './acadmic-program.service';

@Module({
  providers: [AcadmicProgramService]
})
export class AcadmicProgramModule {}
