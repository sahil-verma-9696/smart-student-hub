import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/auth.type';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get dashboard statistics
  @Get('dashboard/stats')
  @UseGuards(JwtAuthGuard)
  async getDashboardStats(@Req() req: AuthenticatedRequest) {
    return await this.adminService.getDashboardStats(req.user!.instituteId);
  }

  // Get analytics data
  @Get('dashboard/analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalyticsData(@Req() req: AuthenticatedRequest) {
    return await this.adminService.getAnalyticsData(req.user!.instituteId);
  }

  // Get recent registrations
  @Get('dashboard/recent-registrations')
  @UseGuards(JwtAuthGuard)
  async getRecentRegistrations(@Req() req: AuthenticatedRequest) {
    return await this.adminService.getRecentRegistrations(req.user!.instituteId);
  }

  // Get recent activities
  @Get('dashboard/recent-activities')
  @UseGuards(JwtAuthGuard)
  async getRecentActivities(@Req() req: AuthenticatedRequest) {
    return await this.adminService.getRecentActivities(req.user!.instituteId);
  }
}
