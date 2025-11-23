import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import InstitueRegistrationDto from './dto/institute-registration-body.dto';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
import { UserLoginBodyDto } from './dto/user-login-body.dto.';
import FacultyRegistrationDto from './dto/faculty-registration-body.dto';

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
    return await this.authService.instituteRegistration(body);
  }

  /**********************************
   * POST : auth/admin/login
   * Body : AdminRegistrationDto
   * Return : AdminRegistrationDto
   * desc : Register Admin
   *********************************/
  @Post('user/login')
  userLogin(@Body() userLoginDto: UserLoginBodyDto) {
    return this.authService.userLogin(userLoginDto);
  }

  /**********************************
   * POST : auth/student/register
   * Body : InstitueRegistrationDto
   * Return : InstitueRegistrationDto
   * desc : Register Student
   *********************************/
  @Post('student/register')
  async studentRegistration(
    @Body() body: StudentRegistrationBodyDto,
    @Query('instituteId') instituteId: string,
  ) {
    return await this.authService.studentRegistration(body, instituteId);
  }

  /**********************************
   * POST : auth/faculty/register
   * Body : InstitueRegistrationDto
   * Return : InstitueRegistrationDto
   * desc : Register Student
   *********************************/
  @Post('faculty/register')
  async facultyRegistration(
    @Body() body: FacultyRegistrationDto,
    @Query('instituteId') institueId: string,
  ) {
    return await this.authService.facultyRegistration(body, institueId);
  }
}
