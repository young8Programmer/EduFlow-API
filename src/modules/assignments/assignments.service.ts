import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../../entities/assignment.entity';
import { AssignmentSubmission } from '../../entities/assignment-submission.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentSubmission)
    private submissionRepository: Repository<AssignmentSubmission>,
  ) {}

  async create(
    title: string,
    groupId: string,
    dueDate: Date,
    description?: string,
    filePath?: string,
  ): Promise<Assignment> {
    const assignment = this.assignmentRepository.create({
      title,
      groupId,
      dueDate,
      description,
      filePath,
    });
    return this.assignmentRepository.save(assignment);
  }

  async findAllByGroup(groupId: string): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: { groupId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Assignment> {
    return this.assignmentRepository.findOne({
      where: { id },
      relations: ['submissions', 'submissions.student'],
    });
  }

  async submitAssignment(
    assignmentId: string,
    studentId: string,
    filePath?: string,
    fileName?: string,
    text?: string,
  ): Promise<AssignmentSubmission> {
    // Check if already submitted
    const existing = await this.submissionRepository.findOne({
      where: { assignmentId, studentId },
    });

    if (existing) {
      existing.filePath = filePath || existing.filePath;
      existing.fileName = fileName || existing.fileName;
      existing.text = text || existing.text;
      return this.submissionRepository.save(existing);
    }

    const submission = this.submissionRepository.create({
      assignmentId,
      studentId,
      filePath,
      fileName,
      text,
    });
    return this.submissionRepository.save(submission);
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    return this.submissionRepository.find({
      where: { assignmentId },
      relations: ['student'],
      order: { submittedAt: 'ASC' },
    });
  }

  async gradeSubmission(
    submissionId: string,
    grade: number,
    comment?: string,
  ): Promise<AssignmentSubmission> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
    });
    if (!submission) {
      throw new Error('Submission not found');
    }
    submission.grade = grade;
    submission.teacherComment = comment;
    submission.isGraded = true;
    return this.submissionRepository.save(submission);
  }

  async archiveSubmissions(assignmentId: string): Promise<string> {
    const submissions = await this.getSubmissionsByAssignment(assignmentId);
    const assignment = await this.findOne(assignmentId);

    // Create archive directory structure
    const archivePath = path.join(
      'uploads',
      'assignments',
      assignment.groupId,
      assignmentId,
    );
    
    if (!fs.existsSync(archivePath)) {
      fs.mkdirSync(archivePath, { recursive: true });
    }

    // Organize submissions by student name
    for (const submission of submissions) {
      if (submission.filePath) {
        const studentName = `${submission.student.firstName}_${submission.student.lastName || ''}`.trim();
        const fileName = submission.fileName || path.basename(submission.filePath);
        const targetPath = path.join(archivePath, `${studentName}_${fileName}`);
        
        if (fs.existsSync(submission.filePath)) {
          fs.copyFileSync(submission.filePath, targetPath);
        }
      }
    }

    return archivePath;
  }
}
