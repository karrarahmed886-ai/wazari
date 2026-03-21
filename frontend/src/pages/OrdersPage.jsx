import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ListChecks, Clock } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lookupId, setLookupId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    async function syncOrders() {
      const storedOrders = JSON.parse(localStorage.getItem('wazari_orders') || '[]');
      if (storedOrders.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const orderIds = storedOrders.map((o) => o.id);
      try {
        const { data: supabaseOrders } = await supabase.from('orders').select('*').in('order_id', orderIds);
        const supabaseMap = new Map((supabaseOrders || []).map((o) => [o.order_id, o]));
        const merged = [];
        for (const local of storedOrders) {
          const remote = supabaseMap.get(local.id);
          if (remote) {
            merged.push({
              id: remote.order_id,
              date: new Date(remote.created_at).toLocaleDateString('ar-IQ'),
              grade: remote.grade,
              subjects: remote.subjects || [],
              total: remote.total,
              status: remote.status
            });
          }
        }
        setOrders(merged);
        localStorage.setItem('wazari_orders', JSON.stringify(merged));
      } catch (err) {
        console.error(err);
        setOrders(storedOrders);
      } finally {
        setLoading(false);
      }
    }
    syncOrders();
  }, []);

  const handleLookupOrder = async () => {
    const id = lookupId.trim().toUpperCase();
    if (!id) return;
    setLookupLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('order_id', id).maybeSingle();
      if (error) throw error;
      if (!data) {
        alert('لم يتم العثور على طلب بهذا الرقم');
        return;
      }
      const mapped = {
        id: data.order_id,
        date: new Date(data.created_at).toLocaleDateString('ar-IQ'),
        grade: data.grade,
        subjects: data.subjects || [],
        total: data.total,
        status: data.status,
      };
      setOrders((prev) => {
        const exists = prev.some((o) => o.id === mapped.id);
        const next = exists ? prev.map((o) => (o.id === mapped.id ? mapped : o)) : [mapped, ...prev];
        localStorage.setItem('wazari_orders', JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء البحث عن الطلب');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-4xl mx-auto pt-10 px-4 pb-20 relative">
      <button onClick={() => navigate('/')} className="absolute right-4 md:right-10 -top-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition">
        <ArrowRight weight="bold" /> العودة للرئيسية
      </button>
      <div className="mb-10 text-right mt-12">
        <h2 className="text-3xl font-bold font-head mb-2 dark:text-white flex items-center gap-3"><ListChecks className="text-primary" /> طلباتي</h2>
        <p className="text-gray-500 dark:text-gray-400">تابع جميع طلباتك وحالتها من هنا</p>
      </div>

      <div className="glass-card p-4 rounded-xl border border-black/10 dark:border-white/10 mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">إذا غيرت المتصفح أو الهاتف، اكتب رقم الطلب لاسترجاعه:</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="مثال: ORD-ABC123"
            className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-gray-900 dark:text-white"
            dir="ltr"
          />
          <button
            onClick={handleLookupOrder}
            disabled={lookupLoading}
            className="bg-primary hover:bg-primaryHover text-white rounded-xl px-4 py-2 font-bold disabled:opacity-70"
          >
            {lookupLoading ? 'جاري البحث...' : 'بحث'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">جاري تحميل الطلبات...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
          <ListChecks weight="light" className="text-6xl text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-4">لا توجد لديك طلبات سابقة</p>
          <button onClick={() => navigate('/')} className="text-primary hover:underline font-bold">تصفح المواد واطلب الآن</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={i} className="glass-card p-6 rounded-xl border border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-black text-gray-900 dark:text-white tracking-widest">{order.id}</span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'مؤكد' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : order.status === 'ملغي' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'}`}>{order.status}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-1">{order.grade}</p>
                <p className="text-xs text-gray-400">{order.subjects.join('، ')}</p>
              </div>
              <div className="text-left w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-2">
                <span className="text-xl font-black text-primary">{order.total}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock weight="bold" /> {order.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrdersPage;