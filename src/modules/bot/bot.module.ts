import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { AuthModule } from '../auth/auth.module';
import { GroupsModule } from '../groups/groups.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { LibraryModule } from '../library/library.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    GroupsModule,
    AssignmentsModule,
    QuizzesModule,
    AttendanceModule,
    LibraryModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
