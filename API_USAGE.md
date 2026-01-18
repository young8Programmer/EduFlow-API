# 📖 Bot Buyruqlari va Foydalanish Qo'llanmasi

## O'qituvchilar uchun

### Guruhlar bilan ishlash

```
/groups - Barcha guruhlarni ko'rish
/create_group - Yangi guruh yaratish
```

**Misol:**
```
/create_group
Bot: 📝 Guruh nomini kiriting:
Siz: 101-guruh
Bot: ✅ Guruh "101-guruh" muvaffaqiyatli yaratildi!
```

### Vazifalar

```
/new_assignment - Yangi vazifa yaratish
/assignments - Vazifalarni ko'rish
```

**Vazifa yaratish:**
1. `/new_assignment` buyrug'ini yuboring
2. Guruhni tanlang
3. Vazifa nomini kiriting (masalan: "Uy vazifasi: 5-mashq")
4. Topshirish muddatini kiriting (YYYY-MM-DD formatida)

**Talabalardan vazifa qabul qilish:**
- Talabalar javob yuborganida, bot avtomatik ravishda:
  - Talaba ismi va guruhi bo'yicha tartiblaydi
  - Fayllarni saqlaydi
  - O'qituvchiga bildirishnoma yuboradi

**Vazifalarni arxivlash:**
- Barcha topshiriqlarni `/assignments` buyrug'i orqali ko'rishingiz mumkin
- Arxivlash avtomatik ravishda amalga oshiriladi

### Testlar (Quiz)

```
/new_quiz - Yangi test yaratish
/quizzes - Testlar ro'yxati
```

**Test yaratish jarayoni:**
1. `/new_quiz` buyrug'ini yuboring
2. Guruhni tanlang
3. Test nomi va savollarini kiriting
4. Har bir savol uchun:
   - Savol matnini kiriting
   - Variantlarni kiriting
   - To'g'ri javob indeksini kiriting
   - Ball miqdorini kiriting

**Natijalarni Excel formatida olish:**
- Test yakunlangandan so'ng, natijalar avtomatik ravishda Excel faylga export qilinadi
- Fayl quyidagi ma'lumotlarni o'z ichiga oladi:
  - Talaba ismi
  - Olingan ball
  - Foiz
  - Topshirilgan vaqt

### Davomat

```
/attendance - Davomat seansini boshlash
```

**Davomat olish:**
1. `/attendance` buyrug'ini yuboring
2. Guruhni tanlang
3. Bot sizga maxsus kod beradi
4. Talabalar 5 daqiqa ichida:
   - Location yuborishlari kerak, YOKI
   - `/checkin` buyrug'i orqali kod kiritishlari kerak

**Davomat natijalari:**
- Seans yakunlangandan so'ng, barcha davomat qilgan talabalar ro'yxati yuboriladi

### Kutubxona

```
/library - Barcha materiallarni ko'rish
/add_material - Yangi material qo'shish
```

**Material qo'shish:**
- Fayl yuklash orqali (kitob, hujjat)
- Video linki qo'shish
- Tafsilotlar (nomi, fan, guruh)

### Bildirishnomalar

```
/broadcast - Barcha talabalarga xabar yuborish
```

**Xabar yuborish:**
1. `/broadcast` buyrug'ini yuboring
2. Xabar matnini kiriting
3. Xabar barcha guruhlar talabalariga yuboriladi

## Talabalar uchun

### Vazifalar

```
/my_assignments - Mening vazifalarim
```

**Vazifani topshirish:**
1. `/my_assignments` buyrug'i orqali vazifalarni ko'ring
2. Vazifa ID-ni yoki nomini yozing
3. Javobingizni fayl yoki rasm ko'rinishida yuboring
4. Bot javobingizni qabul qiladi va saqlaydi

### Testlar

```
/my_quizzes - Mening testlarim
```

**Test yechish:**
1. `/my_quizzes` buyrug'i orqali aktiv testlarni ko'ring
2. Testni boshlang
3. Har bir savolga javob bering
4. Test yakunlanganda, natijangiz avtomatik baholanadi

### Davomat

```
/checkin - Davomatga yozilish
```

**Davomatga yozilish:**
- Dars vaqtida o'qituvchi kod yuborganida:
  1. `/checkin` buyrug'ini yuboring
  2. Kodni kiriting, YOKI
  3. Location yuboring

### Kutubxona

```
/library - Fan bo'yicha materiallarni ko'rish
```

**Materiallarni topish:**
- Fan nomi bo'yicha qidirish
- Materiallarni yuklab olish

## Qo'shimcha ma'lumot

### File formats qo'llab-quvvatlanadi:
- 📄 Hujjatlar: PDF, DOC, DOCX, TXT
- 📷 Rasmlar: JPG, PNG, GIF
- 📦 Arxivlar: ZIP, RAR

### Limitlar:
- Maksimal fayl hajmi: 10MB
- Bir test uchun maksimal savollar soni: 50
- Bir guruh uchun maksimal talabalar soni: cheksiz

### Xatolar bilan ishlash:
Agar xatolik yuz bersa, `/help` buyrug'ini yuborib, yordam olishingiz mumkin.
