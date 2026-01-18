import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '../../entities/quiz.entity';
import { QuizQuestion } from '../../entities/quiz-question.entity';
import { QuizAttempt } from '../../entities/quiz-attempt.entity';
import { QuizAnswer } from '../../entities/quiz-answer.entity';
import { QuizzesService } from './quizzes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizQuestion, QuizAttempt, QuizAnswer]),
  ],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
