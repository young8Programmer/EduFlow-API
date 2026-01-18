import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { AssignmentSubmission } from './assignment-submission.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Group, (group) => group.assignments)
  group: Group;

  @Column()
  groupId: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => AssignmentSubmission, (submission) => submission.assignment)
  submissions: AssignmentSubmission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
