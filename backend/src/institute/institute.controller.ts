import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Patch,
  // Delete,
} from '@nestjs/common';
import { InstituteService } from './institute.service';
import CreateInstituteDto from './dto/create-institute.dto';
import { UpdateInstituteDto } from 'src/auth/dto/update-institute.dto';

@Controller('institute')
export class InstituteController {
  constructor(private readonly instituteService: InstituteService) {}

  @Post()
  create(@Body() createInstituteDto: CreateInstituteDto) {
    return this.instituteService.create(createInstituteDto);
  }

  // @Get()
  // findAll() {
  //   return this.instituteService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instituteService.getInstituteById(id);
  }

  @Patch(':id/institute-details')
  update(
    @Param('id') id: string,
    @Body() updateInstituteDto: UpdateInstituteDto,
  ) {
    return this.instituteService.updateInstitute(updateInstituteDto, id);
  }

  @Get(':id/institute-details')
  getInstitute(@Param('id') id: string) {
    return this.instituteService.getInstituteDetails(id);
  }

  @Get(':id/programs')
  getInstituteProgramDetails(@Param('id') id: string) {
    return this.instituteService.getInstituteProgramsDetails(id);
  }

  @Get(':id/departments')
  getInstituteDepartmentDetails(@Param('id') id: string) {
    return this.instituteService.getInstituteDepartmentsDetails(id);
  }

  @Get(':id/students')
  getInstituteStudents(@Param('id') id: string) {
    return this.instituteService.getInstituteStudents(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.instituteService.remove(+id);
  // }
}
