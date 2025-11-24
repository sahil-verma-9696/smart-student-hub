import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { InstituteModule } from 'src/institute/institute.module';
import { AdminModule } from 'src/admin/admin.module';
import { ConfigService } from '@nestjs/config';
import { StudentModule } from 'src/student/student.module';
import { FacultyModule } from 'src/faculty/faculty.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true, // makes jwtService available everywhere
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UserModule,
    InstituteModule,
    AdminModule,
    StudentModule,
    FacultyModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
