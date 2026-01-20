import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Update, Ctx, Start, Command, On, Action } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import { BotService } from './bot.service';
import { GroupsService } from '../groups/groups.service';
import { AssignmentsService } from '../assignments/assignments.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { AttendanceService } from '../attendance/attendance.service';
import { LibraryService } from '../library/library.service';
import { NotificationsService } from '../notifications/notifications.service';

interface SessionData {
  currentState?: string;
  currentGroupId?: string;
  currentAssignmentId?: string;
  currentQuizId?: string;
  quizAnswers?: { questionId: string; selectedIndex: number }[];
  currentQuestionIndex?: number;
  pendingMessage?: string;
  pendingGroupId?: string;
}

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);
  private sessions: Map<string, SessionData> = new Map();

  constructor(
    private botService: BotService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private groupsService: GroupsService,
    private assignmentsService: AssignmentsService,
    private quizzesService: QuizzesService,
    private attendanceService: AttendanceService,
    private libraryService: LibraryService,
    private notificationsService: NotificationsService,
  ) {}

  private getSession(telegramId: string): SessionData {
    if (!this.sessions.has(telegramId)) {
      this.sessions.set(telegramId, {});
    }
    return this.sessions.get(telegramId);
  }

  private clearSession(telegramId: string): void {
    this.sessions.delete(telegramId);
  }

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    const userData = ctx.from;
    if (!userData) return;

    const user = await this.botService.findOrCreateUser(
      userData.id.toString(),
      userData,
    );

    const welcomeMessage = user.role === Role.TEACHER
      ? `👋 Assalomu alaykum, ${user.firstName}!\n\nO'qituvchi sifatida ro'yxatdan o'tdingiz.\n\n/help - Yordam`
      : `👋 Assalomu alaykum, ${user.firstName}!\n\nTalaba sifatida ro'yxatdan o'tdingiz.\n\n/help - Yordam`;

    await ctx.reply(welcomeMessage);
  }

  @Command('help')
  async helpCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role === Role.TEACHER) {
      const helpText = `
📚 *O'qituvchi menyusi:*

*Vazifalar:*
/assignments - Vazifalar ro'yxati
/new_assignment - Yangi vazifa yaratish

*Testlar:*
/quizzes - Testlar ro'yxati
/new_quiz - Yangi test yaratish

*Davomat:*
/attendance - Davomat seansini boshlash

*Kutubxona:*
/library - Kutubxona materiallari
/add_material - Material qo'shish

*Bildirishnomalar:*
/broadcast - Xabar yuborish

*Guruhlar:*
/groups - Guruhlar ro'yxati
/create_group - Yangi guruh yaratish

*Statistika:*
/stats - Umumiy statistika
      `;
      await ctx.reply(helpText, { parse_mode: 'Markdown' });
    } else {
      const helpText = `
📖 *Talaba menyusi:*

/my_assignments - Mening vazifalarim
/my_quizzes - Mening testlarim
/attendance - Davomatni tekshirish
/library - Kutubxona materiallari
      `;
      await ctx.reply(helpText, { parse_mode: 'Markdown' });
    }
  }

  // TEACHER COMMANDS

  @Command('groups')
  async groupsCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role !== Role.TEACHER) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish uchun ruxsat yo\'q.');
      return;
    }

    const groups = await this.groupsService.findAll();
    if (groups.length === 0) {
      await ctx.reply('📭 Hozircha guruhlar yo\'q.');
      return;
    }

    let message = '📋 *Guruhlar ro\'yxati:*\n\n';
    groups.forEach((group, index) => {
      message += `${index + 1}. ${group.name}\n`;
      if (group.description) {
        message += `   ${group.description}\n`;
      }
      message += `   ID: \`${group.id}\`\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  @Command('create_group')
  async createGroupCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role !== Role.TEACHER) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish uchun ruxsat yo\'q.');
      return;
    }

    const session = this.getSession(ctx.from.id.toString());
    session.currentState = 'creating_group_name';
    await ctx.reply('📝 Guruh nomini kiriting:');
  }

  @Command('new_assignment')
  async newAssignmentCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role !== Role.TEACHER) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish uchun ruxsat yo\'q.');
      return;
    }

    const groups = await this.groupsService.findAll();
    if (groups.length === 0) {
      await ctx.reply('❌ Avval guruh yarating: /create_group');
      return;
    }

    const buttons = groups.map((group) => [
      Markup.button.callback(group.name, `select_group_${group.id}`),
    ]);

    await ctx.reply(
      '📋 Guruhni tanlang:',
      Markup.inlineKeyboard(buttons),
    );
  }

  @Command('assignments')
  async assignmentsCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role !== Role.TEACHER) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish uchun ruxsat yo\'q.');
      return;
    }

    const groups = await this.groupsService.findAll();
    if (groups.length === 0) {
      await ctx.reply('📭 Hozircha guruhlar yo\'q.');
      return;
    }

    const buttons = groups.map((group) => [
      Markup.button.callback(`📚 ${group.name}`, `view_assignments_${group.id}`),
    ]);

    await ctx.reply(
      '📋 Vazifalarni ko\'rish uchun guruhni tanlang:',
      Markup.inlineKeyboard(buttons),
    );
  }

  @Command('new_quiz')
  async newQuizCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role !== Role.TEACHER) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish uchun ruxsat yo\'q.');
      return;
    }

    const groups = await this.groupsService.findAll();
    if (groups.length === 0) {
      await ctx.reply('❌ Avval guruh yarating: /create_group');
      return;
    }

    const buttons = groups.map((group) => [
      Markup.button.callback(group.name, `select_quiz_group_${group.id}`),
    ]);

    await ctx.reply(
      '📋 Test uchun guruhni tanlang:',
      Markup.inlineKeyboard(buttons),
    );
  }

  @Command('attendance')
  async attendanceCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role !== Role.TEACHER) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish uchun ruxsat yo\'q.');
      return;
    }

    const groups = await this.groupsService.findAll();
    if (groups.length === 0) {
      await ctx.reply('❌ Avval guruh yarating: /create_group');
      return;
    }

    const buttons = groups.map((group) => [
      Markup.button.callback(group.name, `start_attendance_${group.id}`),
    ]);

    await ctx.reply(
      '📍 Davomat seansini boshlash uchun guruhni tanlang:',
      Markup.inlineKeyboard(buttons),
    );
  }

  @Command('library')
  async libraryCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    const groupId = user.groupId;

    if (user.role === Role.TEACHER) {
      const materials = await this.libraryService.findAll();
      if (materials.length === 0) {
        await ctx.reply('📚 Hozircha materiallar yo\'q.');
        return;
      }

      let message = '📚 *Kutubxona materiallari:*\n\n';
      const subjects = [...new Set(materials.map((m) => m.subject))];
      
      for (const subject of subjects) {
        message += `📖 *${subject}:*\n`;
        const subjectMaterials = materials.filter((m) => m.subject === subject);
        subjectMaterials.forEach((material) => {
          message += `   • ${material.title}\n`;
        });
        message += '\n';
      }

      await ctx.reply(message, { parse_mode: 'Markdown' });
    } else {
      if (!groupId) {
        await ctx.reply('❌ Siz hali guruhga biriktirilmagansiz.');
        return;
      }

      const materials = await this.libraryService.findAll(groupId);
      if (materials.length === 0) {
        await ctx.reply('📚 Hozircha materiallar yo\'q.');
        return;
      }

      let message = '📚 *Kutubxona materiallari:*\n\n';
      const subjects = [...new Set(materials.map((m) => m.subject))];
      
      for (const subject of subjects) {
        message += `📖 *${subject}:*\n`;
        const subjectMaterials = materials.filter((m) => m.subject === subject);
        subjectMaterials.forEach((material) => {
          message += `   • ${material.title}\n`;
        });
        message += '\n';
      }

      await ctx.reply(message, { parse_mode: 'Markdown' });
    }
  }

  @Command('broadcast')
  async broadcastCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role !== Role.TEACHER) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish uchun ruxsat yo\'q.');
      return;
    }

    const session = this.getSession(ctx.from.id.toString());
    session.currentState = 'broadcast_message';
    await ctx.reply('📢 Yubormoqchi bo\'lgan xabarni kiriting:');
  }

  @Command('stats')
  async statsCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (user.role !== Role.TEACHER) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish uchun ruxsat yo\'q.');
      return;
    }

    const groups = await this.groupsService.findAll();
    let statsMessage = '📊 *Statistika:*\n\n';

    for (const group of groups) {
      const assignments = await this.assignmentsService.findAllByGroup(group.id);
      const activeAssignments = assignments.filter((a) => new Date(a.dueDate) > new Date());
      
      let totalSubmissions = 0;
      for (const assignment of assignments) {
        const submissions = await this.assignmentsService.getSubmissionsByAssignment(assignment.id);
        totalSubmissions += submissions.length;
      }

      statsMessage += `📚 *${group.name}:*\n`;
      statsMessage += `   • Talabalar: ${group.students?.length || 0}\n`;
      statsMessage += `   • Vazifalar: ${assignments.length}\n`;
      statsMessage += `   • Aktiv vazifalar: ${activeAssignments.length}\n`;
      statsMessage += `   • Topshirilgan javoblar: ${totalSubmissions}\n\n`;
    }

    await ctx.reply(statsMessage, { parse_mode: 'Markdown' });
  }

  // STUDENT COMMANDS

  @Command('my_assignments')
  async myAssignmentsCommand(@Ctx() ctx: Context) {
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    if (!user.groupId) {
      await ctx.reply('❌ Siz hali guruhga biriktirilmagansiz.');
      return;
    }

    const assignments = await this.assignmentsService.findAllByGroup(user.groupId);
    if (assignments.length === 0) {
      await ctx.reply('📭 Hozircha vazifalar yo\'q.');
      return;
    }

    let message = '📝 *Mening vazifalarim:*\n\n';
    assignments.forEach((assignment, index) => {
      message += `${index + 1}. *${assignment.title}*\n`;
      if (assignment.description) {
        message += `   ${assignment.description}\n`;
      }
      message += `   Muddat: ${assignment.dueDate.toLocaleDateString('uz-UZ')}\n`;
      message += `   ID: \`${assignment.id}\`\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  // ACTION HANDLERS

  @Action(/^select_group_(.+)$/)
  async selectGroupHandler(@Ctx() ctx: Context) {
    const groupId = ctx.match[1];
    const session = this.getSession(ctx.from.id.toString());
    session.currentGroupId = groupId;
    session.currentState = 'creating_assignment_title';

    await ctx.editMessageText('📝 Vazifa nomini kiriting:');
  }

  @Action(/^start_attendance_(.+)$/)
  async startAttendanceHandler(@Ctx() ctx: Context) {
    const groupId = ctx.match[1];
    
    const session = await this.attendanceService.startSession(groupId, 5);
    const code = session.checkInCode;

    await ctx.editMessageText(
      `✅ Davomat seansi boshlandi!\n\n` +
      `📋 Kod: *${code}*\n` +
      `⏰ Muddati: 5 daqiqa\n\n` +
      `Talabalar /checkin buyrug'i orqali davomat qilishlari mumkin.`,
      { parse_mode: 'Markdown' },
    );
  }

  // MESSAGE HANDLERS

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const session = this.getSession(ctx.from.id.toString());
    const text = (ctx.message as any).text;

    if (session.currentState === 'creating_group_name') {
      try {
        const group = await this.groupsService.create(text);
        this.clearSession(ctx.from.id.toString());
        await ctx.reply(`✅ Guruh "${group.name}" muvaffaqiyatli yaratildi!`);
      } catch (error) {
        await ctx.reply('❌ Xatolik yuz berdi.');
      }
      return;
    }

    if (session.currentState === 'creating_assignment_title') {
      session.pendingMessage = text;
      session.currentState = 'creating_assignment_due_date';
      await ctx.reply('📅 Topshirish muddatini kiriting (YYYY-MM-DD formatida):');
      return;
    }

    if (session.currentState === 'creating_assignment_due_date') {
      try {
        const dueDate = new Date(text);
        await this.assignmentsService.create(
          session.pendingMessage!,
          session.currentGroupId!,
          dueDate,
        );
        this.clearSession(ctx.from.id.toString());
        await ctx.reply('✅ Vazifa muvaffaqiyatli yaratildi!');
      } catch (error) {
        await ctx.reply('❌ Xatolik yuz berdi. Muddat formati noto\'g\'ri.');
      }
      return;
    }

    if (session.currentState === 'broadcast_message') {
      const groups = await this.groupsService.findAll();
      let totalSent = 0;
      
      for (const group of groups) {
        const sent = await this.notificationsService.broadcastToGroup(
          ctx,
          group.id,
          text,
        );
        totalSent += sent;
      }

      this.clearSession(ctx.from.id.toString());
      await ctx.reply(`✅ Xabar ${totalSent} ta talabaga yuborildi!`);
      return;
    }
  }

  @On('document')
  async onDocument(@Ctx() ctx: Context) {
    const document = (ctx.message as any).document;
    const fileId = document.file_id;
    
    // Handle file download and submission logic here
    // This is a simplified version - you'd need to implement file downloading
    
    await ctx.reply('📎 Fayl qabul qilindi!');
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    const photo = (ctx.message as any).photo;
    const fileId = photo[photo.length - 1].file_id;
    
    // Handle photo submission logic here
    
    await ctx.reply('📷 Rasm qabul qilindi!');
  }

  @On('location')
  async onLocation(@Ctx() ctx: Context) {
    const location = (ctx.message as any).location;
    const user = await this.botService.findOrCreateUser(
      ctx.from.id.toString(),
      ctx.from,
    );

    // Handle attendance check-in with location
    // This is simplified - you'd need to find active session for user's group
    
    await ctx.reply('📍 Location qabul qilindi!');
  }
}
