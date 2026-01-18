import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { QuizAnswer } from './quiz-answer.entity';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @Column()
  quizId: string;

  @Column({ type: 'jsonb' })
  options: string[];

  @Column({ type: 'int' })
  correctAnswerIndex: number;

  @Column({ type: 'int' })
  points: number;

  @OneToMany(() => QuizAnswer, (answer) => answer.question)
  answers: QuizAnswer[];

  @CreateDateColumn()
  createdAt: Date;
}
