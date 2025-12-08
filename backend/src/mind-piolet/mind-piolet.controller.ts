import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { MindPioletService } from './mind-piolet.service';
import { CreateMindPioletDto } from './dto/create-mind-piolet.dto';
import { UpdateMindPioletDto } from './dto/update-mind-piolet.dto';
import { mindPioletData } from './constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('mind-piolet')
export class MindPioletController {
  constructor(private readonly mindPioletService: MindPioletService) { }

  @Post()
  create(@Body() createMindPioletDto: CreateMindPioletDto) {
    return this.mindPioletService.create(createMindPioletDto);
  }

  @Get()
  findAll() {
    return mindPioletData;
  }

  /**
   * Get Mind Pilot data for authenticated student
   * Uses student's aggregated skills and activity data
   */
  @UseGuards(JwtAuthGuard)
  @Get('me/data')
  async getMyMindPioletData(@Request() req: any) {
    if (!req.user || !req.user.sub) {
      throw new BadRequestException('User not authenticated');
    }

    return this.mindPioletService.getMindPioletDataForStudent(req.user.sub);
  }

  /**
   * Chat with Mind Pilot using student context
   */
  @UseGuards(JwtAuthGuard)
  @Post('me/chat')
  async chatWithMindPilot(
    @Request() req: any,
    @Body()
    body: {
      message: string;
      role?: string;
      feature: 'skill' | 'roadmap' | 'interview' | 'gap-finder' | 'guidance';
    },
  ) {
    if (!req.user || !req.user.sub) {
      throw new BadRequestException('User not authenticated');
    }

    if (!body.message || !body.feature) {
      throw new BadRequestException('message and feature are required');
    }

    return this.mindPioletService.chatWithMindPilot(
      req.user.sub,
      body.message,
      body.role || 'user',
      body.feature,
    );
  }

  /**
   * Get student skill profile for Mind Pilot
   */
  @UseGuards(JwtAuthGuard)
  @Get('me/skills')
  async getMySkillProfile(@Request() req: any) {
    if (!req.user || !req.user.sub) {
      throw new BadRequestException('User not authenticated');
    }

    return this.mindPioletService.aggregateStudentSkillProfile(req.user.sub);
  }

  @Post('chat')
  chat(@Body() body: { message: string; role: string; studentId: string }) {
    return this.mindPioletService.chat(
      body.message,
      body.role,
      body.studentId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mindPioletService.getMindPioletData(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMindPioletDto: UpdateMindPioletDto,
  ) {
    return this.mindPioletService.update(+id, updateMindPioletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mindPioletService.remove(+id);
  }
}
