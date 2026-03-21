import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';

const REMEMBER_EMAIL_KEY = 'wazari_admin_remember_email';

const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: signError } = await supabase.auth.signInWithPassword({ email, password });
      if (signError) throw signError;

      const { data: adminData } = await supabase.from('admin_users').select('id').eq('email', data.user.email).single();
      if (!adminData) {
        await supabase.auth.signOut();
        throw new Error('ليس لديك صلاحية الدخول');
      }

      if (rememberMe) localStorage.setItem(REMEMBER_EMAIL_KEY, data.user.email);
      else localStorage.removeItem(REMEMBER_EMAIL_KEY);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck weight="fill" className="text-4xl text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-head text-center text-gray-900 dark:text-white mb-2">تسجيل دخول الأدمن</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">منصة وزاري - لوحة التحكم</p>

          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الإيميل</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">تذكرني</span>
            </label>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? 'جاري التحقق...' : 'دخول'} <ArrowRight weight="bold" className="rotate-180" />
            </button>
          </form>

          <button onClick={() => navigate('/')} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition">
            العودة للموقع
          </button>
        </div>
      </div>
    </motion.div>
  );
}
