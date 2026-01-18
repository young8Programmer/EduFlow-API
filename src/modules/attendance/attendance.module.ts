import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceSession } from '../../entities/attendance-session.entity';
import { AttendanceRecord } from '../../entities/attendance-record.entity';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceSession, AttendanceRecord]),
  ],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
