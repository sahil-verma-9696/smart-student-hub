import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import AdminRegistrationDto from './dto/adminRegistration.dto';
import InstitueRegistrationDto from './dto/instituteRegistration.dto';

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
  register(@Body() istituteRegistrationDto: InstitueRegistrationDto) {
    return this.authService.instituteRegistration(istituteRegistrationDto);
  }

  /**********************************
   * POST : auth/admin/register
   * Body : AdminRegistrationDto
   * Return : AdminRegistrationDto
   * desc : Register Admin
   *********************************/
  @Post('admin/register')
  adminRegistration(@Body() adminRegisterDto: AdminRegistrationDto) {
    return this.authService.adminRegistration(adminRegisterDto);
  }

  /**********************************
   * POST : auth/student/register
   * Body : InstitueRegistrationDto
   * Return : InstitueRegistrationDto
   * desc : Register Student
   *********************************/
  @Post('student/register')
  studentRegistration(@Body() adminRegisterDto: AdminRegistrationDto) {
    return this.authService.adminRegistration(adminRegisterDto);
  }
}
