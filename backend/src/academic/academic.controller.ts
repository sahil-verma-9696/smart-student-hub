import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateAcademicDto } from './dto/create-academic.dto';

@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateAcademicDto) {
    return this.academicService.create(dto);
    // create bulk
  }

  // READ ALL
  @Get()
  findAll() {
    return this.academicService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateAcademicDto) {
    return this.academicService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicService.remove(id);
  }
}
