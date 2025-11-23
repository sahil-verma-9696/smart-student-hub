import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import InstitueRegistrationDto from './dto/institute-registration.dto';
import StudentRegistrationDto from './dto/student-registration.dto';

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
  async register(@Body() body: InstitueRegistrationDto) {
    const res = await this.authService.instituteRegistration(body);
    return { ...res.data, msg: res.msg };
  }

  /**********************************
   * POST : auth/admin/register
   * Body : AdminRegistrationDto
   * Return : AdminRegistrationDto
   * desc : Register Admin
   *********************************/
  // @Post('admin/register')
  // adminRegistration(@Body() adminRegisterDto: AdminRegistrationDto) {
  //   return this.authService.adminRegistration(adminRegisterDto);
  // }

  /**********************************
   * POST : auth/student/register
   * Body : InstitueRegistrationDto
   * Return : InstitueRegistrationDto
   * desc : Register Student
   *********************************/
  @Post('student/register')
  async studentRegistration(@Body() body: StudentRegistrationDto) {
    const res = await this.authService.studentRegistration(body);
    return { ...res.data, msg: res.msg };
  }
}
