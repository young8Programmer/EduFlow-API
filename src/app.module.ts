import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { dataSourceOptions } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LibraryModule } from './modules/library/library.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BotModule } from './modules/bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => dataSourceOptions,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    GroupsModule,
    AssignmentsModule,
    QuizzesModule,
    AttendanceModule,
    LibraryModule,
    NotificationsModule,
    BotModule,
  ],
})
export class AppModule {}
