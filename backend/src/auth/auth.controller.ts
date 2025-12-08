import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as authType from './types/auth.type';
import { RegisterInstituteDto } from './dto/register-institute.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**********************************
   * POST : auth/institute/register
   * Body : InstitueRegistrationDto
   * Return : InstitueRegistrationDto
   * desc : Register Institute
   *********************************/
  @Post('institute/register')
  async register(@Body() body: RegisterInstituteDto) {
    return await this.authService.registerInstitute(body);
  }

  /**********************************
   * POST : auth/admin/login
   * Body : AdminRegistrationDto
   * Return : AdminRegistrationDto
   * desc : Register Admin
   *********************************/
  @Post('user/login')
  userLogin(@Body() userLoginDto: LoginDto) {
    return this.authService.userLogin(userLoginDto);
  }

  /**********************************
   * POST : auth/admin/login
   * Body : AdminRegistrationDto
   * Return : AdminRegistrationDto
   * desc : Register Admin
   *********************************/
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: authType.AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.me(req.user); // comes from JwtStrategy.validate()
  }
}
