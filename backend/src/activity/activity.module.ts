import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Activity, ActivitySchema } from './schema/activity.schema';
import { CustomActivitySchema } from './schema/custom.schema';
import { HackathonActivitySchema } from './schema/hackathon.schemas';
import { WorkshopActivitySchema } from './schema/workshop.schema';

import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ACTIVITY_TYPES } from './types/enum';
import { DefaultActivitySchema } from './schema/defaulty.schema';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Activity.name,
        useFactory: () => {
          const schema = ActivitySchema;

          schema.discriminator('custom', CustomActivitySchema);
          schema.discriminator(ACTIVITY_TYPES.DEFAULT, DefaultActivitySchema);
          schema.discriminator('hackathon', HackathonActivitySchema);
          schema.discriminator('workshop', WorkshopActivitySchema);

          return schema;
        },
      },
    ]),

    forwardRef(() => NotificationModule),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
