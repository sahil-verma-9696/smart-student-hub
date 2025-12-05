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
import { FacultyService } from './faculty.service';
import { CreateFacultyAdminDto } from './dto/create-faculty-admin.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../utils/multer.util';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/auth.type';
import * as multer from 'multer';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  // GET: Fetch all faculty records
  @Get()
  async getFacultyData() {
    return await this.facultyService.findAllFaculty();
  }

  // POST: Create new faculty (from frontend form)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createFaculty(@Body() dto: CreateFacultyAdminDto, @Req() req: AuthenticatedRequest) {
    if (!req.user) throw new UnauthorizedException();
    dto.institute = req.user.instituteId;
    return await this.facultyService.create(dto);
  }

  // POST: Create new faculties in bulk
  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadBulk(@UploadedFile() file: multer.File, @Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return await this.facultyService.uploadBulk(file, req.user);
  }

  // GET: Single faculty by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.facultyService.findOne(id);
  }

  // PATCH: Update faculty
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFacultyDto) {
    return await this.facultyService.update(id, dto);
  }

  // DELETE: Remove faculty
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.facultyService.remove(id);
  }
}
