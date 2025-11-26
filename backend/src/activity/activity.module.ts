import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Activity, ActivitySchema } from './schema/activity.schema';
import { CustomActivitySchema } from './schema/custom.schema';
import { HackathonActivitySchema } from './schema/hackathon.schemas';
import { WorkshopActivitySchema } from './schema/workshop.schema';

import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Activity.name,
        useFactory: () => {
          const schema = ActivitySchema;

          schema.discriminator('custom', CustomActivitySchema);
          schema.discriminator('hackathon', HackathonActivitySchema);
          schema.discriminator('workshop', WorkshopActivitySchema);

          return schema;
        },
      },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
