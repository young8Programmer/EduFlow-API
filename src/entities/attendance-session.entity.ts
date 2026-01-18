import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { AttendanceRecord } from './attendance-record.entity';

@Entity('attendance_sessions')
export class AttendanceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.attendanceSessions)
  group: Group;

  @Column()
  groupId: string;

  @Column({ nullable: true })
  checkInCode: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'int', default: 5 })
  durationMinutes: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => AttendanceRecord, (record) => record.session)
  records: AttendanceRecord[];

  @CreateDateColumn()
  createdAt: Date;
}
