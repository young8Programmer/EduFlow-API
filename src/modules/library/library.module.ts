import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryMaterial } from '../../entities/library-material.entity';
import { LibraryService } from './library.service';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryMaterial])],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
