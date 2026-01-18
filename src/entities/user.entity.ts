import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { Group } from './group.entity';
import { AssignmentSubmission } from './assignment-submission.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { AttendanceRecord } from './attendance-record.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  telegramId: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  username: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @ManyToOne(() => Group, (group) => group.students, { nullable: true })
  group: Group;

  @Column({ nullable: true })
  groupId: string;

  @OneToMany(() => AssignmentSubmission, (submission) => submission.student)
  submissions: AssignmentSubmission[];

  @OneToMany(() => QuizAttempt, (attempt) => attempt.student)
  quizAttempts: QuizAttempt[];

  @OneToMany(() => AttendanceRecord, (record) => record.student)
  attendanceRecords: AttendanceRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
