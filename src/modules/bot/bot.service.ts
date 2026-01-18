import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class BotService {
  constructor(private authService: AuthService) {}

  async findOrCreateUser(telegramId: string, userData: any) {
    return this.authService.findOrCreateUser(telegramId, userData);
  }
}
