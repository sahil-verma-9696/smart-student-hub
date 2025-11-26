import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() dto: CreateActivityDto) {
    return this.activityService.create(dto);
  }

  @Get()
  findAll() {
    return this.activityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto) {
    return this.activityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(id);
  }

  // Faculty-specific endpoint to approve activity
  @Patch(':id/approve/:facultyId')
  approve(@Param('id') id: string, @Param('facultyId') facultyId: string) {
    return this.activityService.approve(id, facultyId);
  }

  // Faculty-specific endpoint to reject activity
  @Patch(':id/reject/:facultyId')
  reject(
    @Param('id') id: string,
    @Param('facultyId') facultyId: string,
    @Body('reason') reason: string,
  ) {
    return this.activityService.reject(id, facultyId, reason);
  }
}
