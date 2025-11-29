import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InstituteService } from './institute.service';
import CreateInstituteDto from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';

@Controller('institute')
export class InstituteController {
  constructor(private readonly instituteService: InstituteService) {}

  // 🏛️ CREATE INSTITUTE (Registration - programs NOT required)
  @Post()
  create(@Body() createInstituteDto: CreateInstituteDto) {
    return this.instituteService.create(createInstituteDto);
  }

  // 📋 GET ALL INSTITUTES
  @Get()
  findAll() {
    return this.instituteService.findAll();
  }

  // 🔍 GET ONE INSTITUTE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instituteService.findOne(id);
  }

  // ✏️ UPDATE INSTITUTE (Admin can update including programs)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstituteDto: UpdateInstituteDto,
  ) {
    return this.instituteService.update(id, updateInstituteDto);
  }

  // 🗑️ DELETE INSTITUTE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instituteService.remove(id);
  }

  // 🎓 ADD PROGRAM TO INSTITUTE
  @Patch(':id/program/add')
  addProgram(
    @Param('id') id: string,
    @Body('programId') programId: string,
  ) {
    return this.instituteService.addProgram(id, programId);
  }

  // ➖ REMOVE PROGRAM FROM INSTITUTE
  @Patch(':id/program/remove')
  removeProgram(
    @Param('id') id: string,
    @Body('programId') programId: string,
  ) {
    return this.instituteService.removeProgram(id, programId);
  }
}
