import { Inject, Injectable } from '@nestjs/common';
import { StudentGateway } from './ports/student.gateway';

@Injectable()
export class StudentService {
  constructor(@Inject('StudentGateway') private readonly gateway: StudentGateway) {}

  getByNationalCode(nationalCode: string) {
    return this.gateway.getByNationalCode(nationalCode);
  }
}
