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

## GitHub Pages — ليش يظهر README مو الموقع؟

الرابط `username.github.io/wazari/` يعرض **ملفات جاهزة (HTML/CSS/JS)** من مجلد النشر. إذا ضبطت Pages على **فرع بدون build**، GitHub يعرض **README** من جذر المشروع.

لعرض **تطبيق React** الحقيقي:

1. في المستودع: **Settings → Pages**  
2. **Build and deployment → Source**: اختر **GitHub Actions** (ليس Deploy from a branch على الجذر فقط).
3. ادفع التغييرات؛ سيعمل workflow الملف `.github/workflows/deploy-github-pages.yml` فيبني `frontend` ويرفع `dist`.
4. في **Settings → Secrets and variables → Actions** أضف نفس متغيرات `VITE_*` الموجودة في `.env` حتى يعمل Supabase والبوت بعد النشر:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_TELEGRAM_BOT_TOKEN`
   - `VITE_TELEGRAM_CHAT_ID`

> إذا **غيّرت اسم المستودع** عن `wazari`، عدّل في ملف الـ workflow القيمة `VITE_BASE_URL: /wazari/` إلى `/اسم-المستودع-الجديد/` (مع الشرطتين `/` في البداية والنهاية).

---

## أمان

- ملفات `.env` مُستبعدة في `.gitignore` — لا تشارك مفاتيح Supabase أو Telegram في المستودع العام.
- أسرار النشر على GitHub تُخزَّن كـ **Repository secrets** (ما تظهر في الكود).
