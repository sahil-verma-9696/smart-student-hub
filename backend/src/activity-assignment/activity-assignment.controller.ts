import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ActivityAssignmentService } from './activity-assignment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activity-assignment')
@UseGuards(JwtAuthGuard)
export class ActivityAssignmentController {
  constructor(
    private readonly activityAssignmentService: ActivityAssignmentService,
  ) {}

  // CREATE - Create new assignment (Auto-created when activity is created, but can be manual)
  @Post()
  async create(@Body() payload: any, @Req() req: any) {
    return this.activityAssignmentService.create(payload);
  }

  // GET ALL - Get all assignments (Admin only)
  @Get()
  async findAll() {
    return this.activityAssignmentService.findAll({});
  }

  // GET by Activity ID
  @Get('activity/:activityId')
  async getByActivity(@Param('activityId') activityId: string) {
    return this.activityAssignmentService.findByActivityId(activityId);
  }

  // GET assignments for a specific faculty
  @Get('faculty/:facultyId')
  async getForFaculty(@Param('facultyId') facultyId: string) {
    return this.activityAssignmentService.getAssignmentsForFaculty(facultyId);
  }

  // GET assignments for a specific student
  @Get('student/:studentId')
  async getForStudent(@Param('studentId') studentId: string) {
    return this.activityAssignmentService.findByStudentId(studentId);
  }

  // ASSIGN Faculty - Assign faculty to an activity
  @Patch(':activityId/assign')
  async assignFaculty(
    @Param('activityId') activityId: string,
    @Body('facultyId') facultyId: string,
  ) {
    return this.activityAssignmentService.assignFaculty(activityId, facultyId);
  }

  // REASSIGN Faculty - Change assigned faculty
  @Patch(':activityId/reassign')
  async reassignFaculty(
    @Param('activityId') activityId: string,
    @Body('newFacultyId') newFacultyId: string,
  ) {
    return this.activityAssignmentService.reassignFaculty(
      activityId,
      newFacultyId,
    );
  }

  // UNASSIGN Faculty - Remove faculty assignment
  @Patch(':activityId/unassign')
  async unassignFaculty(@Param('activityId') activityId: string) {
    return this.activityAssignmentService.unassignFaculty(activityId);
  }

  // UPDATE - Generic update (for frontend PATCH requests)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    // Check if facultyId is being updated
    if ('facultyId' in updateData) {
      const assignment = await this.activityAssignmentService.findAll({
        _id: id,
      });
      if (assignment && assignment[0]) {
        const activityId = assignment[0].activityId.toString();
        if (updateData.facultyId === null) {
          return this.activityAssignmentService.unassignFaculty(activityId);
        } else {
          return this.activityAssignmentService.assignFaculty(
            activityId,
            updateData.facultyId,
          );
        }
      }
    }
    throw new Error('Update operation not supported');
  }

  // DELETE - Delete assignment
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    // Find the assignment first to get activityId
    const assignments = await this.activityAssignmentService.findAll({
      _id: id,
    });
    if (assignments && assignments[0]) {
      await this.activityAssignmentService.removeByActivity(
        assignments[0].activityId.toString(),
      );
    }
  }
}
