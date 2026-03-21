# إعداد لوحة الأدمن

## 1. تنفيذ SQL في Supabase

1. ادخل إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. من القائمة الجانبية: **SQL Editor** > **New Query**
4. انسخ محتوى ملف `frontend/supabase-schema.sql` والصقه
5. اضغط **Run**

## 2. إنشاء حساب أدمن

1. من Supabase: **Authentication** > **Users** > **Add user** > **Create new user**
2. أدخل إيميلك وكلمة مرور
3. اضغط **Create user**

## 3. إضافة الإيميل كأدمن

1. من Supabase: **SQL Editor** > **New Query**
2. نفّذ الأمر (استبدل الإيميل بإيميلك):

```sql
INSERT INTO admin_users (email) VALUES ('your-email@example.com');
```

## 4. الدخول للوحة الأدمن

1. افتح الموقع وانتقل إلى: `/admin/login`
2. أدخل الإيميل وكلمة المرور اللذين أنشأتهما
3. بعد تسجيل الدخول ستُوجّه إلى `/admin`

## ملاحظات

- تأكد أن **Email** مفعّل في: Authentication > Providers > Email
- الأسعار الافتراضية تُدرج تلقائياً عند أول تشغيل للـ SQL
- الطلبات الجديدة تُحفظ في Supabase وتُرسل إلى Telegram كما هو الحال سابقاً
