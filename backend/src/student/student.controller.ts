import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Query,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
// import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BulkCreateStudentDto } from './dto/create-student-bulk.dto';
import { StudentQueryDto } from './dto/query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { mindPioletData, MOCK_STUDENT_DATA } from './constants';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // --------------------
  // SINGLE STUDENT CREATE
  // --------------------
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  // --------------------
  // BULK UPLOAD VIA CSV
  // --------------------
  @Post('/bulk/csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/csv',
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file && file.originalname.endsWith('.csv')) {
          return cb(null, true);
        }
        return cb(
          new BadRequestException('Only CSV files allowed in bulk mode'),
          false,
        );
        cb(null, true);
      },
    }),
  )
  async createOrBulkUpload(
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (file === undefined) {
      throw new BadRequestException(
        'Bulk upload requires CSV file. Use POST /student?bulk=true with file.',
      );
    }

    // body ignored in bulk mode (form-data validation disabled)
    return this.studentService.bulkUploadStudents(file.path);
  }

  // --------------------
  // BULK UPLOAD VIA JSON
  // --------------------
  @Post('/bulk/json')
  async createOrBulkUploadJson(@Body() body: BulkCreateStudentDto) {
    const data: BulkCreateStudentDto = {
      instituteId: body.instituteId,
      students: body.students,
    };
    return this.studentService.bulkCreateStudents(data);
  }

  @Get()
  findStudents(@Query() query: StudentQueryDto) {
    return this.studentService.findStudents(query);
  }

  @Patch(':id')
  updateStudent(@Param('id') id: string, @Body() body: UpdateStudentDto) {
    return this.studentService.updateStudentAcademicDetails(id, body);
  }

  @Get(':id/portfolio-data')
  getPortfolioData(@Param('id') id: string) {
    return MOCK_STUDENT_DATA;
  }
  @Get(':id/mind-piolet-data')
  getMindPioletData(@Param('id') id: string) {
    return mindPioletData;
  }
}
