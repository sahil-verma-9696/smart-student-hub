import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AcademicService } from './academic.service';

@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Post()
  create(@Body() body: any) {
    return this.academicService.create(body);
  }

  @Get(':studentId')
  getByStudent(@Param('studentId') studentId: string) {
    return this.academicService.getByStudent(studentId);
  }

  @Patch(':studentId')
  update(@Param('studentId') studentId: string, @Body() updateData: any) {
    return this.academicService.updateForStudent(studentId, updateData);
  }

  // @Patch('/institute/:instituteId')
  // updateInstitute(
  //   @Param('instituteId') instituteId: string,
  //   @Body() updateData: any,
  // ) {
  //   return this.academicService.updateForInstitute(instituteId, updateData);
  // }
}
