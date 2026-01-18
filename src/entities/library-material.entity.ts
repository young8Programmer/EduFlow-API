import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';

export enum MaterialType {
  BOOK = 'BOOK',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  PRESENTATION = 'PRESENTATION',
  OTHER = 'OTHER',
}

@Entity('library_materials')
export class LibraryMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  subject: string;

  @ManyToOne(() => Group, { nullable: true })
  group: Group;

  @Column({ nullable: true })
  groupId: string;

  @Column({
    type: 'enum',
    enum: MaterialType,
    default: MaterialType.DOCUMENT,
  })
  type: MaterialType;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  fileSize: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  externalUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
