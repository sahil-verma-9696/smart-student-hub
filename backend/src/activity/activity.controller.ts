import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { SearchActivityDto } from './dto/search-activity.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() dto: CreateActivityDto) {
    return this.activityService.create(dto);
  }

  @Get()
  findAll(@Query() query: SearchActivityDto) {
    return this.activityService.findAll(query);
  }

  @Get('stats')
  getStudentActivityStats(@Query('studentId') studentId: string) {
    return this.activityService.getStudentActivityStats(studentId);
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
}
