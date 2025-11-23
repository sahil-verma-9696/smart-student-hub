import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { InstituteModule } from './institute/institute.module';
import { FacultyModule } from './faculty/faculty.module';
import { ActivityModule } from './activity/activity.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    /** ****** Configuring env ******* */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    /** ****** Connecting to MongoDB ******* */
    MongooseModule.forRoot(process.env.MONGO_URI!),

    /** ****** Authentication Module ****** */
    AuthModule,

    StudentModule,

    InstituteModule,

    ActivityModule,

    FacultyModule,

    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
