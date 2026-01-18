# 🏗️ Loyiha Arxitekturasi

## Umumiy struktura

```
EduFlow API
├── src/
│   ├── config/           # Database va umumiy sozlamalar
│   ├── entities/         # TypeORM database entities
│   ├── modules/          # Feature modules (NestJS)
│   │   ├── auth/         # Autentifikatsiya
│   │   ├── users/        # Foydalanuvchilar CRUD
│   │   ├── groups/       # Guruhlar boshqaruvi
│   │   ├── assignments/  # Vazifalar tizimi
│   │   ├── quizzes/      # Test tizimi
│   │   ├── attendance/   # Davomat tizimi
│   │   ├── library/      # Kutubxona
│   │   ├── notifications/# Bildirishnomalar
│   │   └── bot/          # Telegram bot handlers
│   └── common/           # Guards, decorators, utilities
└── uploads/              # Yuklangan fayllar
```

## Database Schema

### Asosiy Entities

1. **User** - Foydalanuvchilar (O'qituvchi/Talaba)
   - `id`, `telegramId`, `firstName`, `lastName`, `username`
   - `role` (TEACHER/STUDENT)
   - `groupId` (ForeignKey -> Group)

2. **Group** - Guruhlar
   - `id`, `name`, `description`
   - Relations: students, assignments, quizzes, attendanceSessions

3. **Assignment** - Vazifalar
   - `id`, `title`, `description`, `dueDate`
   - `groupId` (ForeignKey -> Group)
   - Relations: submissions

4. **AssignmentSubmission** - Topshirilgan vazifalar
   - `id`, `text`, `filePath`, `fileName`
   - `assignmentId`, `studentId` (ForeignKeys)
   - `grade`, `teacherComment`, `isGraded`

5. **Quiz** - Testlar
   - `id`, `title`, `description`, `totalPoints`
   - `startTime`, `endTime`
   - Relations: questions, attempts

6. **QuizQuestion** - Test savollari
   - `id`, `question`, `options` (JSON array)
   - `correctAnswerIndex`, `points`
   - `quizId` (ForeignKey -> Quiz)

7. **QuizAttempt** - Test topshirilishi
   - `id`, `totalPoints`, `earnedPoints`, `percentage`
   - `quizId`, `studentId` (ForeignKeys)
   - Relations: answers

8. **QuizAnswer** - Javoblar
   - `id`, `selectedAnswerIndex`, `isCorrect`, `pointsEarned`
   - `questionId`, `attemptId` (ForeignKeys)

9. **AttendanceSession** - Davomat seanslari
   - `id`, `checkInCode`, `latitude`, `longitude`
   - `startTime`, `endTime`, `durationMinutes`
   - `groupId` (ForeignKey -> Group)

10. **AttendanceRecord** - Davomat yozuvlari
    - `id`, `latitude`, `longitude`, `checkInCode`
    - `sessionId`, `studentId` (ForeignKeys)

11. **LibraryMaterial** - Kutubxona materiallari
    - `id`, `title`, `subject`, `type`
    - `filePath`, `externalUrl`
    - `groupId` (ForeignKey -> Group, optional)

## Module Structure

Har bir module quyidagi strukturaga ega:

```
module-name/
├── module-name.module.ts    # NestJS module
├── module-name.service.ts   # Business logic
└── module-name.controller.ts # REST API (ixtiyoriy)
```

## Telegram Bot Architecture

### Bot Update Handler

`BotUpdate` class barcha Telegram buyruqlarini qayta ishlaydi:

- **Commands**: `/start`, `/help`, `/new_assignment`, va h.k.
- **Actions**: Inline keyboard button bosilganda
- **Messages**: Text, document, photo, location

### Session Management

Har bir foydalanuvchi uchun session ma'lumotlari saqlanadi:
- `currentState` - Hozirgi holat (conversation flow)
- `currentGroupId`, `currentAssignmentId` - Context ma'lumotlari
- `pendingMessage` - Kutilayotgan ma'lumotlar

## File Management

### Upload Structure

```
uploads/
├── assignments/
│   └── {groupId}/
│       └── {assignmentId}/
│           ├── student1_file.pdf
│           └── student2_file.pdf
├── library/
│   └── {subject}/
│       └── {materialId}/
│           └── file.pdf
└── exports/
    └── quizzes/
        └── quiz_{quizId}_{timestamp}.xlsx
```

## Security

### RBAC (Role-Based Access Control)

- **Roles**: `TEACHER`, `STUDENT`
- **Guards**: `RolesGuard` - route protection
- **Decorators**: `@Roles()` - role requirements

### Data Validation

- `class-validator` - DTO validation
- `ValidationPipe` - Global validation

## Excel Export

Quiz natijalari `exceljs` kutubxonasi yordamida export qilinadi:

- Format: `.xlsx`
- Columns: №, Ism, Familiya, Umumiy ball, Olingan ball, Foiz, Vaqt
- Location: `uploads/exports/quizzes/`

## Error Handling

- Try-catch blocks barcha service metodlarida
- User-friendly error messages Telegram-da
- Logging Logger service orqali

## Future Improvements

- [ ] Web dashboard (ixtiyoriy)
- [ ] Real-time notifications WebSocket orqali
- [ ] Advanced analytics va reporting
- [ ] Multi-language support
- [ ] Integration with LMS systems
