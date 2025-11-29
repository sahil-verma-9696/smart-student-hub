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
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../utils/multer.util';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/auth.type';
import * as multer from 'multer';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  // ➕ CREATE PROGRAM (Admin adds after institute registration)
  @Post('create')
  async create(@Body() dto: CreateProgramDto) {
    return await this.programService.create(dto);
  }

  // 📥 BULK UPLOAD PROGRAMS (Excel with Level, Degree, Branch, Specialization, Intake columns)
  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadBulk(
    @UploadedFile() file: multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return await this.programService.uploadBulk(file, req.user);
  }

  // 📋 GET ALL PROGRAMS
  @Get()
  async findAll() {
    return await this.programService.findAll();
  }

  // 📋 GET PROGRAMS BY INSTITUTE
  @Get('institute/:instituteId')
  async findByInstitute(@Param('instituteId') instituteId: string) {
    return await this.programService.findByInstitute(instituteId);
  }

  // 📋 GET PROGRAMS BY LEVEL (UG, PG, Diploma, PhD, Certification)
  @Get('level/:level')
  async findByLevel(@Param('level') level: string) {
    return await this.programService.findByLevel(level);
  }

  // 📋 GET PROGRAMS BY DEGREE (BTech, BCA, MBA, etc.)
  @Get('degree/:degree')
  async findByDegree(@Param('degree') degree: string) {
    return await this.programService.findByDegree(degree);
  }

  // 🔍 GET ONE PROGRAM
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.programService.findOne(id);
  }

  // ✏️ UPDATE PROGRAM
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return await this.programService.update(id, dto);
  }

  // 🗑️ DELETE PROGRAM
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.programService.remove(id);
  }

  // 📊 UPDATE INTAKE (Admin can update seat count)
  @Patch(':id/intake')
  async updateIntake(@Param('id') id: string, @Body('intake') intake: number) {
    return await this.programService.updateIntake(id, intake);
  }
}
