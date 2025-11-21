import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { InstituteModule } from './institute/institute.module';
import { FacultyModule } from './faculty/faculty.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    /** ****** Authentication Module ****** */
    AuthModule,

    /** ****** Configuring env ******* */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    /** ****** Connecting to MongoDB ******* */
    MongooseModule.forRoot(process.env.MONGO_URI!),

    StudentModule,

    InstituteModule,

    ActivityModule,

    FacultyModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
