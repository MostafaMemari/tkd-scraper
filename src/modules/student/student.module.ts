import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { TkdModule } from '../../infrastructure/tkd/tkd.module';
import { TkdStudentGateway } from '../../infrastructure/tkd/tkd-student.gateway';

@Module({
  imports: [TkdModule],
  controllers: [StudentController],
  providers: [
    StudentService,
    {
      provide: 'StudentGateway',
      useExisting: TkdStudentGateway,
    },
  ],
})
export class StudentModule {}
