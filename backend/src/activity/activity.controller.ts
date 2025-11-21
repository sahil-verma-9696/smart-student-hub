// activity.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(@Body() data: CreateActivityDto) {
    return this.activityService.create(data);
  }

  @Get()
  async getAll() {
    return this.activityService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateActivityDto) {
    return this.activityService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.activityService.remove(id);
  }
}
