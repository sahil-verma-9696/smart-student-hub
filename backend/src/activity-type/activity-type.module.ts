import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ActivityTypeController } from './activity-type.controller';
import { ActivityTypeService } from './activity-type.service';
import { ActivityType, ActivityTypeSchema } from './schema/activity-type.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityType.name, schema: ActivityTypeSchema },
    ]),
    PassportModule,
    AuthModule,
  ],
  controllers: [ActivityTypeController],
  providers: [ActivityTypeService],
  exports: [ActivityTypeService],
})
export class ActivityTypeModule {}
