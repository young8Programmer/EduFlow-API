import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Assignment } from './assignment.entity';

@Entity('assignment_submissions')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions)
  assignment: Assignment;

  @Column()
  assignmentId: string;

  @ManyToOne(() => User, (user) => user.submissions)
  student: User;

  @Column()
  studentId: string;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ type: 'int', nullable: true })
  grade: number;

  @Column({ type: 'text', nullable: true })
  teacherComment: string;

  @Column({ default: false })
  isGraded: boolean;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
