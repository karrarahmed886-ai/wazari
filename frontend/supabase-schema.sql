-- منصة وزاري - جداول Supabase
-- نفّذ هذا الملف في Supabase Dashboard: SQL Editor > New Query

-- 1. جدول الأسعار
CREATE TABLE IF NOT EXISTS prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج الأسعار الافتراضية
INSERT INTO prices (key, value) VALUES
  ('single_price', 10),
  ('all_price', 50),
  ('single_original', 15),
  ('all_original', 150)
ON CONFLICT (key) DO NOTHING;

-- 2. جدول اكتمال المواد (امتحان منتهي)
CREATE TABLE IF NOT EXISTS subject_completion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(grade, subject)
);

-- 3. جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  contact_method TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  subjects JSONB NOT NULL,
  total TEXT NOT NULL,
  cards JSONB NOT NULL,
  status TEXT DEFAULT 'قيد المراجعة',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول أدمن (الإيميلات المسموح لها)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. تفعيل RLS
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 6. سياسات prices (حذف إن وُجدت ثم إنشاء)
DROP POLICY IF EXISTS "الجميع يقرأ الأسعار" ON prices;
DROP POLICY IF EXISTS "الجميع يحدث الأسعار" ON prices;
CREATE POLICY "الجميع يقرأ الأسعار" ON prices FOR SELECT USING (true);
CREATE POLICY "الجميع يحدث الأسعار" ON prices FOR ALL USING (true);

-- 7. سياسات subject_completion
DROP POLICY IF EXISTS "الجميع يقرأ حالة المواد" ON subject_completion;
DROP POLICY IF EXISTS "الجميع يحدث حالة المواد" ON subject_completion;
CREATE POLICY "الجميع يقرأ حالة المواد" ON subject_completion FOR SELECT USING (true);
CREATE POLICY "الجميع يحدث حالة المواد" ON subject_completion FOR ALL USING (true);

-- 8. سياسات orders
DROP POLICY IF EXISTS "الجميع يدرج الطلبات" ON orders;
DROP POLICY IF EXISTS "الجميع يقرأ الطلبات" ON orders;
DROP POLICY IF EXISTS "الجميع يحدث الطلبات" ON orders;
DROP POLICY IF EXISTS "الجميع يحذف الطلبات" ON orders;
CREATE POLICY "الجميع يدرج الطلبات" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "الجميع يقرأ الطلبات" ON orders FOR SELECT USING (true);
CREATE POLICY "الجميع يحدث الطلبات" ON orders FOR UPDATE USING (true);
CREATE POLICY "الجميع يحذف الطلبات" ON orders FOR DELETE USING (true);

-- 9. سياسات admin_users
DROP POLICY IF EXISTS "الجميع يقرأ admin_users" ON admin_users;
CREATE POLICY "الجميع يقرأ admin_users" ON admin_users FOR SELECT USING (true);

-- إدراج الأدمن: نفّذ في SQL Editor بعد إنشاء حسابك في Authentication > Users
-- INSERT INTO admin_users (email) VALUES ('your-email@example.com');
