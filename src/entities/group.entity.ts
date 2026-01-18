import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Assignment } from './assignment.entity';
import { Quiz } from './quiz.entity';
import { AttendanceSession } from './attendance-session.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.group)
  students: User[];

  @OneToMany(() => Assignment, (assignment) => assignment.group)
  assignments: Assignment[];

  @OneToMany(() => Quiz, (quiz) => quiz.group)
  quizzes: Quiz[];

  @OneToMany(() => AttendanceSession, (session) => session.group)
  attendanceSessions: AttendanceSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
