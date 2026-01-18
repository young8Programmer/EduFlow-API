import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Context } from 'telegraf';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async broadcastToGroup(
    ctx: Context,
    groupId: string,
    message: string,
  ): Promise<number> {
    const students = await this.userRepository.find({
      where: { groupId },
    });

    let sentCount = 0;
    for (const student of students) {
      try {
        await ctx.telegram.sendMessage(student.telegramId, message);
        sentCount++;
      } catch (error) {
        console.error(`Failed to send message to ${student.telegramId}:`, error);
      }
    }

    return sentCount;
  }

  async broadcastToAll(ctx: Context, message: string): Promise<number> {
    const students = await this.userRepository.find({
      where: { role: 'STUDENT' as any },
    });

    let sentCount = 0;
    for (const student of students) {
      try {
        await ctx.telegram.sendMessage(student.telegramId, message);
        sentCount++;
      } catch (error) {
        console.error(`Failed to send message to ${student.telegramId}:`, error);
      }
    }

    return sentCount;
  }
}
