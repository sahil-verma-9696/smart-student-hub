import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../utils/multer.util';
// import { CreateStudentUserDto } from './dto/create-student-user.dto';
import * as multer from 'multer';
import { CreateStudentAdminDto } from './dto/create-student-admin.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/auth.type';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createStudent(@Body() dto: CreateStudentAdminDto, @Req() req: AuthenticatedRequest) {
    if (!req.user) throw new UnauthorizedException();
    dto.institute = req.user.instituteId;
    const result = await this.studentService.createStudentFromAdmin(dto);
    return { data: result };    // <-- MUST RETURN { data: ... } for interceptor
  }


  @Post('bulk-upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadBulk(@UploadedFile() file: multer.File, @Req() req: AuthenticatedRequest) {
    console.log('📥 FILE NAME:', file?.originalname);
    console.log('📦 FILE CONTENT:', file?.buffer.toString('utf-8').slice(0, 200)); // only first 200 chars

    if (!req.user) {
      throw new UnauthorizedException();
    }

    return await this.studentService.uploadBulk(file, req.user);
  }

  @Get()
async findAll() {
  return await this.studentService.findAll();
  
}



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    console.log('Received ID:', id);
    console.log('Body Data:', updateStudentDto);
    return this.studentService.update(id, updateStudentDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id); // ✔
  }
}