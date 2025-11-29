import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StudentService } from './student.service';
// import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentDto } from './dto/create-basic-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @Post('/bulk')
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

  @Get()
  findAll() {
    return this.studentService.getAllStudents();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.studentService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
  //   return this.studentService.update(+id, updateStudentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.studentService.remove(+id);
  // }
}
