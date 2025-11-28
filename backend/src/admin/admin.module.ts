import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { InstituteModule } from 'src/institute/institute.module';

@Module({
  impInstituteModuleorts: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    UserModule,
    ,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
