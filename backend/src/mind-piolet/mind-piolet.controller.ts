import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { MindPioletService } from './mind-piolet.service';
import { AnalysisRequestDto } from './dto/analysis-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/auth.type';

@Controller('mind-piolet')
@UseGuards(JwtAuthGuard)
export class MindPioletController {
  constructor(private readonly mindPioletService: MindPioletService) {}

  @Post('skill')
  analyzeSkills(@Req() req: AuthenticatedRequest, @Body() dto: AnalysisRequestDto) {
    return this.mindPioletService.analyzeSkills(req.user!.userId, dto);
  }

  @Post('roadmap')
  generateRoadmap(@Req() req: AuthenticatedRequest, @Body() dto: AnalysisRequestDto) {
    return this.mindPioletService.generateRoadmap(req.user!.userId, dto);
  }

  @Post('interview')
  interviewPrep(@Req() req: AuthenticatedRequest, @Body() dto: AnalysisRequestDto) {
    return this.mindPioletService.interviewPrep(req.user!.userId, dto);
  }

  @Get('history')
  getHistory(@Req() req: AuthenticatedRequest) {
    return this.mindPioletService.getHistory(req.user!.userId);
  }
}
