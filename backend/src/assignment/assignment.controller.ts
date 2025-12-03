import { Controller } from '@nestjs/common';

/**
 * AssignmentController is intentionally empty.
 * All assignment-related routes are handled by:
 * - AdminController for admin operations (bulk assign, reassign, view all)
 * - FacultyController for faculty operations (view my assigned activities)
 */
@Controller('assignment')
export class AssignmentController {}
