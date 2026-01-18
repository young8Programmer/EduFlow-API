import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryMaterial, MaterialType } from '../../entities/library-material.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(LibraryMaterial)
    private materialRepository: Repository<LibraryMaterial>,
  ) {}

  async addMaterial(
    title: string,
    subject: string,
    type: MaterialType,
    groupId?: string,
    filePath?: string,
    fileName?: string,
    fileSize?: string,
    mimeType?: string,
    externalUrl?: string,
    description?: string,
  ): Promise<LibraryMaterial> {
    const material = this.materialRepository.create({
      title,
      subject,
      type,
      groupId,
      filePath,
      fileName,
      fileSize,
      mimeType,
      externalUrl,
      description,
    });
    return this.materialRepository.save(material);
  }

  async findBySubject(subject: string, groupId?: string): Promise<LibraryMaterial[]> {
    const where: any = { subject };
    if (groupId) {
      where.groupId = groupId;
    }
    return this.materialRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(groupId?: string): Promise<LibraryMaterial[]> {
    const where = groupId ? { groupId } : {};
    return this.materialRepository.find({
      where,
      order: { subject: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LibraryMaterial> {
    return this.materialRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.materialRepository.delete(id);
  }
}
