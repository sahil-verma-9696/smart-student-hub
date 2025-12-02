import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { PartialType } from '@nestjs/mapped-types';
import { BulkCreateFacultyDto } from './dto/create-faculty-bulk.dto';
import { FacultyQueryDto } from './dto/query.dto';

class UpdateFacultyDto extends PartialType(CreateFacultyDto) {}

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  async create(@Body() dto: CreateFacultyDto) {
    return await this.facultyService.createFaculty(dto);
  }
  @Post('/bulk')
  async createBulk(@Body() dto: BulkCreateFacultyDto) {
    return await this.facultyService.bulkCreateFaculties(dto);
  }

  @Get()
  findStudents(@Query() query: FacultyQueryDto) {
    return this.facultyService.getFacultiesByQuery(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.facultyService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFacultyDto) {
    return await this.facultyService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.facultyService.remove(id);
  }
}
