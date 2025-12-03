import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { AssignmentService } from '../assignment/assignment.service';
import { CreateAssignmentDto } from '../assignment/dto/create-assignment.dto';
import { BulkAssignDto } from '../assignment/dto/bulk-assign.dto';
import { ReassignActivityDto } from '../assignment/dto/reassign-activity.dto';
import { QueryAssignmentDto } from '../assignment/dto/query-assignment.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly assignmentService: AssignmentService) {}

  /**
   * Admin: Assign a single activity to a faculty
   * POST /admin/assignment
   */
  @Post('assignment')
  async assignActivity(@Body() dto: CreateAssignmentDto) {
    return this.assignmentService.assignActivity(dto);
  }

  /**
   * Admin: Bulk assign multiple activities to a faculty
   * POST /admin/assignment/bulk
   */
  @Post('assignment/bulk')
  async bulkAssignActivities(@Body() dto: BulkAssignDto) {
    return this.assignmentService.bulkAssignActivities(dto);
  }

  /**
   * Admin: Reassign an activity to a different faculty
   * PATCH /admin/assignment/reassign
   */
  @Patch('assignment/reassign')
  async reassignActivity(@Body() dto: ReassignActivityDto) {
    return this.assignmentService.reassignActivity(dto);
  }

  /**
   * Admin: Get all assignments with optional filters
   * GET /admin/assignment?facultyId=xxx&instituteId=xxx
   */
  @Get('assignment')
  async getAssignments(@Query() query: QueryAssignmentDto) {
    return this.assignmentService.getAssignments(query);
  }

  /**
   * Admin: Get assignment by activity ID
   * GET /admin/assignment/activity/:activityId
   */
  @Get('assignment/activity/:activityId')
  async getAssignmentByActivityId(@Param('activityId') activityId: string) {
    return this.assignmentService.getAssignmentByActivityId(activityId);
  }

  /**
   * Admin: Unassign an activity
   * DELETE /admin/assignment/activity/:activityId
   */
  @Delete('assignment/activity/:activityId')
  async unassignActivity(@Param('activityId') activityId: string) {
    await this.assignmentService.unassignActivity(activityId);
    return { message: 'Activity unassigned successfully' };
  }

  /**
   * Admin: Get faculty assignment counts for an institute
   * GET /admin/assignment/faculty-counts/:instituteId
   */
  @Get('assignment/faculty-counts/:instituteId')
  async getFacultyAssignmentCounts(@Param('instituteId') instituteId: string) {
    return this.assignmentService.getFacultyAssignmentCounts(instituteId);
  }
}
