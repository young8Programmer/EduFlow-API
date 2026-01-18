import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['group'] });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['group'],
    });
  }

  async findByGroup(groupId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { groupId },
      relations: ['group'],
    });
  }

  async updateRole(userId: string, role: Role): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.role = role;
    return this.userRepository.save(user);
  }

  async assignToGroup(userId: string, groupId: string | null): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.groupId = groupId;
    return this.userRepository.save(user);
  }
}
