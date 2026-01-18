import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AttendanceSession } from './attendance-session.entity';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AttendanceSession, (session) => session.records)
  session: AttendanceSession;

  @Column()
  sessionId: string;

  @ManyToOne(() => User, (user) => user.attendanceRecords)
  student: User;

  @Column()
  studentId: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ nullable: true })
  checkInCode: string;

  @CreateDateColumn()
  checkedInAt: Date;
}
