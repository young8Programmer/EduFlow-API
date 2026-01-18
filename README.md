# EduAssistant: Avtomatlashtirilgan Imtihon va Vazifalar Nazorati Boti

Telegram bot orqali o'qituvchilarga vazifalarni nazorat qilish, testlar tashkil etish, davomat olish va materiallar bilan ishlashda yordam beruvchi professional yechim.

## 🌟 Asosiy Xususiyatlar

- 📝 **Vazifalar Qabulxonasi**: Talabalarning topshirilgan vazifalarini avtomatik tartiblash va arxivlash
- ✅ **Avtomatik Test Tizimi**: Savollar yuklash, javoblarni tekshirish va Excel formatida natijalar
- 📍 **Davomat Tizimi**: Location yoki kod orqali davomat olish
- 📚 **Kutubxona**: Fan bo'yicha materiallar (kitoblar, videolar) bilan ishlash
- 📢 **Bildirishnomalar**: Barcha talabalarga bir vaqtda xabar yuborish

## 🛠 Texnologiyalar

- **NestJS** - Backend framework
- **TypeORM** - ORM
- **PostgreSQL** - Database
- **Telegraf** - Telegram Bot API
- **ExcelJS** - Excel fayllar bilan ishlash

## 📦 O'rnatish

1. Dependencieslarni o'rnatish:
```bash
npm install
```

2. Environment faylini sozlash:
```bash
cp .env.example .env
# .env faylini ochib kerakli ma'lumotlarni kiriting
```

3. Database migrationlarni ishga tushirish:
```bash
npm run migration:run
```

4. Loyihani ishga tushirish:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📁 Loyiha Strukturasi

```
src/
├── config/          # Database va boshqa sozlamalar
├── entities/        # TypeORM entities
├── modules/         # Feature modules
│   ├── auth/       # Autentifikatsiya
│   ├── users/      # Foydalanuvchilar
│   ├── groups/     # Guruhlar
│   ├── assignments/# Vazifalar
│   ├── quizzes/    # Testlar
│   ├── attendance/ # Davomat
│   ├── library/    # Kutubxona
│   └── notifications/ # Bildirishnomalar
├── common/          # Guards, decorators, pipes
└── main.ts         # Entry point
```

## 🔐 Rollar

- **TEACHER** - O'qituvchi (admin huquqlari)
- **STUDENT** - Talaba

## 📚 Qo'shimcha Hujjatlar

- [API_USAGE.md](./API_USAGE.md) - Bot buyruqlari va foydalanish qo'llanmasi
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment yo'riqnomasi
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Loyiha arxitekturasi

## 🚀 Tezkor Boshlash

1. **Database o'rnatish** (PostgreSQL kerak)
2. **Bot token olish** (@BotFather orqali)
3. **.env faylini sozlash** (database va bot token)
4. **npm install** - dependencies o'rnatish
5. **npm run start:dev** - development mode

## 💡 Asosiy Funksiyalar

### O'qituvchilar uchun:
- ✅ Guruhlar yaratish va boshqarish
- ✅ Vazifalar e'lon qilish va qabul qilish
- ✅ Testlar yaratish va avtomatik baholash
- ✅ Davomat seanslarni boshlash
- ✅ Materiallar kutubxonasini boshqarish
- ✅ Umumiy xabarlar yuborish

### Talabalar uchun:
- ✅ Vazifalarni ko'rish va topshirish
- ✅ Testlarni yechish
- ✅ Davomatga yozilish
- ✅ Kutubxona materiallarini olish

## 📝 License

MIT

## 👨‍💻 Yaratuvchi

Bu loyiha o'qituvchilar va talabalar uchun professional darajada yaratilgan.
