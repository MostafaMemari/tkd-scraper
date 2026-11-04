import { Controller, Get, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentInfo } from './types/student-info';

@Controller('students')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get('by-national-code')
  async getStudent(@Query('nationalCode') nationalCode: string): Promise<StudentInfo> {
    return this.service.getByNationalCode(nationalCode);
  }
}
