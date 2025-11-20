import { Module } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { InstituteController } from './institute.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Institute, InstituteSchema } from './schemas/institute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institute.name, schema: InstituteSchema },
    ]),
  ],
  controllers: [InstituteController],
  providers: [InstituteService],
})
export class InstituteModule {}
