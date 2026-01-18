import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async create(name: string, description?: string): Promise<Group> {
    const group = this.groupRepository.create({ name, description });
    return this.groupRepository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepository.find({
      relations: ['students'],
    });
  }

  async findOne(id: string): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['students'],
    });
  }

  async update(id: string, name?: string, description?: string): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new Error('Group not found');
    }
    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    return this.groupRepository.save(group);
  }

  async delete(id: string): Promise<void> {
    await this.groupRepository.delete(id);
  }
}
