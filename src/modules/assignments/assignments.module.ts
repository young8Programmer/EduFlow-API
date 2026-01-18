import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from '../../entities/assignment.entity';
import { AssignmentSubmission } from '../../entities/assignment-submission.entity';
import { AssignmentsService } from './assignments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, AssignmentSubmission]),
  ],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
