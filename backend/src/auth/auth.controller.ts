import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import InstitueRegistrationDto from './dto/institute-registration.dto';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
import { UserLoginBodyDto } from './dto/user-login-body.dto.';

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
    const res = await this.authService.studentRegistration(body, instituteId);
    return { ...res.data, msg: res.msg };
  }

  /**********************************
   * POST : auth/faculty/register
   * Body : InstitueRegistrationDto
   * Return : InstitueRegistrationDto
   * desc : Register Student
   *********************************/
  // @Post('faculty/register')
  // async facultyRegistration(@Body() body: FacultyRegistrationDto) {
  //   const res = await this.authService.facultyRegistration(body);
  //   return { ...res.data, msg: res.msg };
  // }
}
