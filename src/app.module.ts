import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './modules/student/student.module';
import { GuestModule } from './modules/guest/guest.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), StudentModule, GuestModule],
})
export class AppModule {}
