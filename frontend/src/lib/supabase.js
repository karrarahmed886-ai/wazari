import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/** false إذا لم تُضف متغيرات البيئة (مثلاً نسيت Secrets في GitHub Actions) */
export const supabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && /^https?:\/\//i.test(supabaseUrl)
);

// createClient(undefined, ...) يرمي خطأ فوراً → React لا يُرسم (شاشة بيضاء مع <title> فقط)
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder';

export const supabase = createClient(
  supabaseConfigured ? supabaseUrl : fallbackUrl,
  supabaseConfigured ? supabaseAnonKey : fallbackKey
);
