import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { PartialType } from '@nestjs/mapped-types';

class UpdateFacultyDto extends PartialType(CreateFacultyDto) {}

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  async create(@Body() dto: CreateFacultyDto) {
    // quick debug log to verify request reaches controller
    // (remove or replace with proper logger later)
    // eslint-disable-next-line no-console
    console.log('[faculty:create] incoming body ->', JSON.stringify(dto));
    const result = await this.facultyService.create(dto);
    // eslint-disable-next-line no-console
    console.log('[faculty:create] result ->', result && (result._id || result));
    return result;
  }

  @Get()
  async findAll() {
    return await this.facultyService.findAll();
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
