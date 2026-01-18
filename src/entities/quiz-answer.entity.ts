import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';
import { QuizAttempt } from './quiz-attempt.entity';

@Entity('quiz_answers')
export class QuizAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QuizQuestion, (question) => question.answers)
  question: QuizQuestion;

  @Column()
  questionId: string;

  @ManyToOne(() => QuizAttempt, (attempt) => attempt.answers, {
    onDelete: 'CASCADE',
  })
  attempt: QuizAttempt;

  @Column()
  attemptId: string;

  @Column({ type: 'int' })
  selectedAnswerIndex: number;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @Column({ type: 'int' })
  pointsEarned: number;

  @CreateDateColumn()
  answeredAt: Date;
}
