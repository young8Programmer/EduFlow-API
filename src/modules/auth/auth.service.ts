import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOrCreateUser(telegramId: string, userData: any): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { telegramId },
      relations: ['group'],
    });

    if (!user) {
      user = this.userRepository.create({
        telegramId,
        firstName: userData.first_name || '',
        lastName: userData.last_name || null,
        username: userData.username || null,
        role: Role.STUDENT,
      });
      await this.userRepository.save(user);
    } else {
      // Update user data
      user.firstName = userData.first_name || user.firstName;
      user.lastName = userData.last_name || user.lastName;
      user.username = userData.username || user.username;
      await this.userRepository.save(user);
    }

    return user;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { telegramId },
      relations: ['group'],
    });
  }
}
