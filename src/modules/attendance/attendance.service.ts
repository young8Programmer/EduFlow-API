import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { AttendanceSession } from '../../entities/attendance-session.entity';
import { AttendanceRecord } from '../../entities/attendance-record.entity';
import { addMinutes } from 'date-fns';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceSession)
    private sessionRepository: Repository<AttendanceSession>,
    @InjectRepository(AttendanceRecord)
    private recordRepository: Repository<AttendanceRecord>,
  ) {}

  async startSession(
    groupId: string,
    durationMinutes: number = 5,
    checkInCode?: string,
    latitude?: number,
    longitude?: number,
  ): Promise<AttendanceSession> {
    const session = this.sessionRepository.create({
      groupId,
      checkInCode: checkInCode || this.generateCode(),
      latitude,
      longitude,
      durationMinutes,
      startTime: new Date(),
      isActive: true,
    });
    return this.sessionRepository.save(session);
  }

  async checkIn(
    sessionId: string,
    studentId: string,
    checkInCode?: string,
    latitude?: number,
    longitude?: number,
  ): Promise<AttendanceRecord | null> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session || !session.isActive) {
      return null;
    }

    // Check if session is still valid
    const endTime = addMinutes(session.startTime, session.durationMinutes);
    if (new Date() > endTime) {
      session.isActive = false;
      await this.sessionRepository.save(session);
      return null;
    }

    // Validate check-in code if provided
    if (checkInCode && session.checkInCode !== checkInCode) {
      return null;
    }

    // Check if already checked in
    const existing = await this.recordRepository.findOne({
      where: { sessionId, studentId },
    });

    if (existing) {
      return existing;
    }

    const record = this.recordRepository.create({
      sessionId,
      studentId,
      checkInCode,
      latitude,
      longitude,
    });
    return this.recordRepository.save(record);
  }

  async getSessionRecords(sessionId: string): Promise<AttendanceRecord[]> {
    return this.recordRepository.find({
      where: { sessionId },
      relations: ['student'],
      order: { checkedInAt: 'ASC' },
    });
  }

  async endSession(sessionId: string): Promise<AttendanceSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      throw new Error('Session not found');
    }
    session.isActive = false;
    session.endTime = new Date();
    return this.sessionRepository.save(session);
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async cleanupExpiredSessions(): Promise<void> {
    const sessions = await this.sessionRepository.find({
      where: { isActive: true },
    });

    const now = new Date();
    for (const session of sessions) {
      const endTime = addMinutes(session.startTime, session.durationMinutes);
      if (now > endTime) {
        session.isActive = false;
        session.endTime = endTime;
        await this.sessionRepository.save(session);
      }
    }
  }
}
