import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Quiz } from './quiz.entity';
import { QuizAnswer } from './quiz-answer.entity';

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts)
  quiz: Quiz;

  @Column()
  quizId: string;

  @ManyToOne(() => User, (user) => user.quizAttempts)
  student: User;

  @Column()
  studentId: string;

  @Column({ type: 'int' })
  totalPoints: number;

  @Column({ type: 'int' })
  earnedPoints: number;

  @Column({ type: 'float' })
  percentage: number;

  @OneToMany(() => QuizAnswer, (answer) => answer.attempt)
  answers: QuizAnswer[];

  @CreateDateColumn()
  completedAt: Date;
}
