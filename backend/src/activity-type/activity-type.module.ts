import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityTypeController } from './activity-type.controller';
import { ActivityTypeService } from './activity-type.service';
import { ActivityType, ActivityTypeSchema } from './schema/activity-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityType.name, schema: ActivityTypeSchema },
    ]),
  ],
  controllers: [ActivityTypeController],
  providers: [ActivityTypeService],
})
export class ActivityTypeModule {}
