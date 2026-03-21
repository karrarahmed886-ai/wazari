import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CurrencyDollar, BookOpenText, ListChecks, X, Check, Trash, Eye } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { usePrices } from '@/hooks/usePrices';
import { useOrders } from '@/hooks/useOrders';
import { gradeSubjects } from '@/data/grades';

const pageVariants = { initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { prices, loading: pricesLoading } = usePrices();
  const { orders, loading: ordersLoading, refresh, updateStatus, deleteOrder } = useOrders();

  const [activeTab, setActiveTab] = useState('prices');
  const [priceForm, setPriceForm] = useState({ single_price: 10, all_price: 50, single_original: 15, all_original: 150 });
  const [priceSaving, setPriceSaving] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('السادس ابتدائي');
  const [completions, setCompletions] = useState({});
  const [detailOrder, setDetailOrder] = useState(null);

  useEffect(() => {
    setPriceForm(prices);
  }, [prices]);

  useEffect(() => {
    async function loadCompletions() {
      const { data } = await supabase.from('subject_completion').select('grade, subject, completed').eq('completed', true);
      const map = {};
      (data || []).forEach(({ grade, subject }) => {
        if (!map[grade]) map[grade] = new Set();
        map[grade].add(subject);
      });
      setCompletions(map);
    }
    loadCompletions();
  }, [activeTab]);

  const handleSavePrices = async () => {
    setPriceSaving(true);
    try {
      const rows = Object.entries(priceForm).map(([key, value]) => ({ key, value: Number(value) }));
      await supabase.from('prices').upsert(rows, { onConflict: 'key' });
    } catch (err) {
      console.error(err);
    }
    setPriceSaving(false);
  };

  const toggleSubjectCompletion = async (grade, subject) => {
    const isCompleted = completions[grade]?.has(subject);
    try {
      await supabase.from('subject_completion').upsert(
        { grade, subject, completed: !isCompleted, updated_at: new Date().toISOString() },
        { onConflict: 'grade,subject' }
      );
      setCompletions((prev) => {
        const next = { ...prev };
        if (!next[grade]) next[grade] = new Set();
        if (isCompleted) next[grade].delete(subject);
        else next[grade].add(subject);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const subjects = gradeSubjects[selectedGrade] || [];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold font-head text-gray-900 dark:text-white">لوحة الأدمن</h1>
          <div className="flex gap-2">
            <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
              الموقع <ArrowRight weight="bold" />
            </button>
            <button onClick={handleSignOut} className="text-sm text-red-500 hover:text-red-600">تسجيل الخروج</button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'prices', label: 'الأسعار', icon: CurrencyDollar },
            { id: 'subjects', label: 'المواد', icon: BookOpenText },
            { id: 'orders', label: 'الطلبات', icon: ListChecks },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <tab.icon weight="bold" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'prices' && (
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 dark:text-white">تعديل الأسعار</h2>
            {pricesLoading ? <p className="text-gray-500">جاري التحميل...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'single_price', label: 'سعر المادة الواحدة ($)' },
                  { key: 'single_original', label: 'السعر المشطب للمادة ($)' },
                  { key: 'all_price', label: 'سعر جميع المواد ($)' },
                  { key: 'all_original', label: 'السعر المشطب للجميع ($)' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                    <input type="number" min="0" value={priceForm[key] ?? ''} onChange={(e) => setPriceForm((p) => ({ ...p, [key]: e.target.value }))} className="w-full bg-black/5 dark:bg-white/5 border rounded-xl py-2 px-4 text-gray-900 dark:text-white" dir="ltr" />
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleSavePrices} disabled={priceSaving} className="mt-6 bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-70">
              {priceSaving ? 'جاري الحفظ...' : 'حفظ الأسعار'}
            </button>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 dark:text-white">اكتمال امتحانات المواد</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">حدد المواد التي انتهى امتحانها ليظهر "تم الانتهاء من الامتحان" في الموقع</p>
            <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="mb-6 bg-black/5 dark:bg-white/5 border rounded-xl py-2 px-4 text-gray-900 dark:text-white">
              {Object.keys(gradeSubjects).map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="flex flex-wrap gap-3">
              {subjects.map((sub) => {
                const isCompleted = completions[selectedGrade]?.has(sub);
                return (
                  <button key={sub} onClick={() => toggleSubjectCompletion(selectedGrade, sub)} className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${isCompleted ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                    {isCompleted && <Check weight="bold" />} {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass-card p-6 rounded-2xl overflow-x-auto">
            <h2 className="text-xl font-bold mb-6 dark:text-white">الطلبات</h2>
            {ordersLoading ? <p className="text-gray-500">جاري التحميل...</p> : orders.length === 0 ? <p className="text-gray-500">لا توجد طلبات</p> : (
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10">
                    <th className="py-3 px-2 font-bold text-gray-900 dark:text-white">رقم الطلب</th>
                    <th className="py-3 px-2 font-bold text-gray-900 dark:text-white">الاسم</th>
                    <th className="py-3 px-2 font-bold text-gray-900 dark:text-white">الصف</th>
                    <th className="py-3 px-2 font-bold text-gray-900 dark:text-white">الإجمالي</th>
                    <th className="py-3 px-2 font-bold text-gray-900 dark:text-white">الحالة</th>
                    <th className="py-3 px-2 font-bold text-gray-900 dark:text-white">التاريخ</th>
                    <th className="py-3 px-2 font-bold text-gray-900 dark:text-white">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-gray-100 dark:border-white/5">
                      <td className="py-3 px-2 text-gray-700 dark:text-gray-300 font-mono">{o.order_id}</td>
                      <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{o.name}</td>
                      <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{o.grade}</td>
                      <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{o.total}</td>
                      <td className="py-3 px-2"><span className={`px-2 py-1 rounded-lg text-xs font-bold ${o.status === 'مؤكد' ? 'bg-green-500/20 text-green-600' : o.status === 'ملغي' ? 'bg-red-500/20 text-red-600' : 'bg-yellow-500/20 text-yellow-600'}`}>{o.status}</span></td>
                      <td className="py-3 px-2 text-gray-500 text-sm">{new Date(o.created_at).toLocaleDateString('ar-IQ')}</td>
                      <td className="py-3 px-2 flex gap-1">
                        <button onClick={() => setDetailOrder(o)} className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30" title="التفاصيل"><Eye weight="bold" /></button>
                        {o.status !== 'مؤكد' && <button onClick={() => updateStatus(o.id, 'مؤكد')} className="p-2 rounded-lg bg-green-500/20 text-green-600 hover:bg-green-500/30" title="تأكيد"><Check weight="bold" /></button>}
                        {o.status !== 'ملغي' && <button onClick={() => updateStatus(o.id, 'ملغي')} className="p-2 rounded-lg bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30" title="إلغاء">إلغاء</button>}
                        <button onClick={() => { if (confirm('حذف هذا الطلب؟')) deleteOrder(o.id); }} className="p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30" title="حذف"><Trash weight="bold" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {detailOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailOrder(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold dark:text-white">تفاصيل الطلب {detailOrder.order_id}</h3>
                <button onClick={() => setDetailOrder(null)}><X weight="bold" className="text-xl" /></button>
              </div>
              <div className="space-y-3 text-right">
                <p><span className="text-gray-500">الاسم:</span> {detailOrder.name}</p>
                <p><span className="text-gray-500">التواصل ({detailOrder.contact_method}):</span> {detailOrder.contact_id}</p>
                <p><span className="text-gray-500">الصف:</span> {detailOrder.grade}</p>
                <p><span className="text-gray-500">المواد:</span> {(detailOrder.subjects || []).join('، ')}</p>
                <p><span className="text-gray-500">الإجمالي:</span> {detailOrder.total}</p>
                <p><span className="text-gray-500">الكروت:</span></p>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg font-mono text-sm" dir="ltr">
                  {(detailOrder.cards || []).map((c, i) => <div key={i}>{c}</div>)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
