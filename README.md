# منصة وزاري (Wazari)

مشروع واجهة الطالب (React + Vite) مع مجلدات إضافية للأتمتة والصور.

## البنية

| المجلد | الوصف |
|--------|--------|
| `frontend/` | تطبيق الويب (Vite + React + Tailwind + Supabase) |
| `automation/` | سكربتات Appium لأسياسيل (اختياري) |
| `images/` | أصول صور |

## التشغيل المحلي (`frontend`)

```powershell
cd frontend
npm install
npm run dev
```

أنشئ ملف `frontend/.env` من القالب (انظر `ADMIN_SETUP.md` أو نسخة `.env.example` إن وُجدت) — **لا ترفع `.env` إلى GitHub.**

---

## رفع المشروع على GitHub

### 1) تثبيت Git (مرة واحدة)

- حمّل **Git for Windows**: https://git-scm.com/download/win  
- أثناء التثبيت اختر خيار إضافة Git إلى **PATH**.
- أعد فتح PowerShell أو Cursor.

تحقق:

```powershell
git --version
```

### 2) إنشاء مستودع جديد على GitHub

1. ادخل https://github.com/new  
2. اختر اسم المشروع (مثلاً `wazari`)  
3. **لا** تضع علامة على "Add a README" إذا ستربط مجلداً محلياً جاهزاً.  
4. أنشئ المستودع وانسخ رابط **HTTPS** (مثل `https://github.com/USERNAME/wazari.git`).

### 3) أوامر الرفع (من مجلد المشروع)

في PowerShell:

```powershell
cd C:\Users\nsr\Desktop\wazari

git init
git add .
git commit -m "Initial commit: Wazari platform"
git branch -M main
git remote add origin https://github.com/USERNAME/wazari.git
git push -u origin main
```

استبدل `USERNAME` واسم المستودع برابطك.

عند أول `git push` قد يطلب منك تسجيل الدخول — استخدم **Personal Access Token** كلمة مرور (ليس كلمة مرور GitHub العادية)، من:  
**GitHub → Settings → Developer settings → Personal access tokens.**

### بديل: GitHub Desktop

إن واجهت صعوبة مع الطرفية، ثبّت **GitHub Desktop** واسحب مجلد `wazari` واضغط Publish.

---

## أمان

- ملفات `.env` مُستبعدة في `.gitignore` — لا تشارك مفاتيح Supabase أو Telegram في المستودع العام.
