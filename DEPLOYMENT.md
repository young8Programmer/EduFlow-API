# 🚀 Deployment Guide

## Telegram Bot o'rnatish

### 1. Bot Token olish

1. Telegram-da [@BotFather](https://t.me/BotFather) ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomi va username tanlang
4. Bot token-ni oling (masalan: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Database o'rnatish

PostgreSQL o'rnatish va ma'lumotlar bazasini yaratish:

```bash
# PostgreSQL o'rnatish (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# PostgreSQL ishga tushirish
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Database yaratish
sudo -u postgres psql
CREATE DATABASE eduflow;
CREATE USER eduflow_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE eduflow TO eduflow_user;
\q
```

### 3. Environment o'zgaruvchilarni sozlash

`.env` faylini yarating:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=eduflow_user
DB_PASSWORD=your_password
DB_DATABASE=eduflow

TELEGRAM_BOT_TOKEN=your_bot_token_here

PORT=3000
NODE_ENV=production

MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 4. Loyihani o'rnatish

```bash
# Dependencies o'rnatish
npm install

# Database migrationlar
npm run migration:run

# Build
npm run build

# Ishga tushirish (production)
npm run start:prod
```

### 5. PM2 bilan ishga tushirish (tavsiya etiladi)

```bash
# PM2 o'rnatish
npm install -g pm2

# PM2 bilan ishga tushirish
pm2 start dist/main.js --name eduflow-bot

# Autostart o'rnatish
pm2 startup
pm2 save
```

### 6. Nginx Reverse Proxy (ixtiyoriy)

Agar REST API ham kerak bo'lsa:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Docker bilan ishga tushirish

`Dockerfile` yaratish (ixtiyoriy):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

## Testing

Botni test qilish:

1. Telegram-da botingizni toping
2. `/start` buyrug'ini yuboring
3. O'qituvchi sifatida ro'yxatdan o'ting
4. `/help` buyrug'i orqali barcha buyruqlarni ko'ring

## Troubleshooting

### Bot ishlamayapti
- `.env` faylida `TELEGRAM_BOT_TOKEN` to'g'ri ekanligini tekshiring
- Database ulanishini tekshiring
- Loglarni ko'ring: `pm2 logs eduflow-bot`

### Database xatolari
- PostgreSQL ishlab turganligini tekshiring: `sudo systemctl status postgresql`
- Database credentials to'g'ri ekanligini tekshiring
- Migrationlar bajarilganligini tekshiring

### File upload xatolari
- `uploads` papkasi yaratilganligini tekshiring
- File permissions-ni tekshiring: `chmod -R 755 uploads`
