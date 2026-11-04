import { Controller, Get, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentInfo } from './types/student-info';
import { GetStudentByNationalCodeDto } from './dto/get-student-by-national-code.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get('by-national-code')
  async getStudent(@Query() dto: GetStudentByNationalCodeDto): Promise<StudentInfo> {
    return this.service.getByNationalCode(dto.nationalCode);
  }
}
