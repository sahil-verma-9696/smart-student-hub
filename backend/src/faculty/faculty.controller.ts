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
import { AssignmentService } from '../assignment/assignment.service';

class UpdateFacultyDto extends PartialType(CreateFacultyDto) {}

@Controller('faculty')
export class FacultyController {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly assignmentService: AssignmentService,
  ) {}

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

  /**
   * Faculty: Get all activities assigned to a specific faculty
   * GET /faculty/:facultyId/assignments
   */
  @Get(':facultyId/assignments')
  async getMyAssignedActivities(
    @Param('facultyId') facultyId: string,
    @Query('instituteId') instituteId?: string,
  ) {
    return this.assignmentService.getActivitiesByFacultyId(
      facultyId,
      instituteId,
    );
  }

  /**
   * Faculty: Get assignment by activity ID (to check who it's assigned to)
   * GET /faculty/assignment/activity/:activityId
   */
  @Get('assignment/activity/:activityId')
  async getAssignmentByActivityId(@Param('activityId') activityId: string) {
    return this.assignmentService.getAssignmentByActivityId(activityId);
  }
}
