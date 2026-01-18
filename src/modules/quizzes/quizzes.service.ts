import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../../entities/quiz.entity';
import { QuizQuestion } from '../../entities/quiz-question.entity';
import { QuizAttempt } from '../../entities/quiz-attempt.entity';
import { QuizAnswer } from '../../entities/quiz-answer.entity';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private questionRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
    @InjectRepository(QuizAnswer)
    private answerRepository: Repository<QuizAnswer>,
  ) {}

  async create(
    title: string,
    groupId: string,
    totalPoints: number,
    startTime?: Date,
    endTime?: Date,
    description?: string,
  ): Promise<Quiz> {
    const quiz = this.quizRepository.create({
      title,
      groupId,
      totalPoints,
      startTime,
      endTime,
      description,
    });
    return this.quizRepository.save(quiz);
  }

  async addQuestion(
    quizId: string,
    question: string,
    options: string[],
    correctAnswerIndex: number,
    points: number,
  ): Promise<QuizQuestion> {
    const quizQuestion = this.questionRepository.create({
      quizId,
      question,
      options,
      correctAnswerIndex,
      points,
    });
    return this.questionRepository.save(quizQuestion);
  }

  async getQuizWithQuestions(quizId: string): Promise<Quiz> {
    return this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });
  }

  async submitQuizAnswers(
    quizId: string,
    studentId: string,
    answers: { questionId: string; selectedIndex: number }[],
  ): Promise<QuizAttempt> {
    const quiz = await this.getQuizWithQuestions(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let earnedPoints = 0;
    let totalPoints = 0;

    // Create attempt
    const attempt = this.attemptRepository.create({
      quizId,
      studentId,
      totalPoints: quiz.totalPoints,
      earnedPoints: 0,
      percentage: 0,
    });
    const savedAttempt = await this.attemptRepository.save(attempt);

    // Process each answer
    for (const answerData of answers) {
      const question = quiz.questions.find((q) => q.id === answerData.questionId);
      if (!question) continue;

      totalPoints += question.points;
      const isCorrect = answerData.selectedIndex === question.correctAnswerIndex;
      const pointsEarned = isCorrect ? question.points : 0;
      earnedPoints += pointsEarned;

      const answer = this.answerRepository.create({
        questionId: answerData.questionId,
        attemptId: savedAttempt.id,
        selectedAnswerIndex: answerData.selectedIndex,
        isCorrect,
        pointsEarned,
      });
      await this.answerRepository.save(answer);
    }

    // Update attempt
    savedAttempt.earnedPoints = earnedPoints;
    savedAttempt.percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    return this.attemptRepository.save(savedAttempt);
  }

  async getAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
    return this.attemptRepository.find({
      where: { quizId },
      relations: ['student', 'answers', 'answers.question'],
      order: { completedAt: 'DESC' },
    });
  }

  async generateExcelReport(quizId: string): Promise<string> {
    const quiz = await this.getQuizWithQuestions(quizId);
    const attempts = await this.getAttemptsByQuiz(quizId);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Quiz Results');

    // Headers
    worksheet.columns = [
      { header: '№', key: 'number', width: 5 },
      { header: 'Ism', key: 'firstName', width: 20 },
      { header: 'Familiya', key: 'lastName', width: 20 },
      { header: 'Umumiy ball', key: 'totalPoints', width: 12 },
      { header: 'Olingan ball', key: 'earnedPoints', width: 12 },
      { header: 'Foiz', key: 'percentage', width: 10 },
      { header: 'Vaqt', key: 'completedAt', width: 20 },
    ];

    // Data rows
    attempts.forEach((attempt, index) => {
      worksheet.addRow({
        number: index + 1,
        firstName: attempt.student.firstName,
        lastName: attempt.student.lastName || '',
        totalPoints: attempt.totalPoints,
        earnedPoints: attempt.earnedPoints,
        percentage: `${attempt.percentage.toFixed(2)}%`,
        completedAt: attempt.completedAt.toLocaleString('uz-UZ'),
      });
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Save file
    const exportPath = path.join('uploads', 'exports', 'quizzes');
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    const fileName = `quiz_${quizId}_${Date.now()}.xlsx`;
    const filePath = path.join(exportPath, fileName);
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }
}
