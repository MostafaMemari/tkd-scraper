import { StudentInfo } from '../types/student-info';

export interface StudentGateway {
  getByNationalCode(nationalCode: string): Promise<StudentInfo>;
}
