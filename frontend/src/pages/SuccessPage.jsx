import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ListChecks } from '@phosphor-icons/react';

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

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true });
      return;
    }
    const existingOrders = JSON.parse(localStorage.getItem('wazari_orders') || '[]');
    const orderExists = existingOrders.some(order => order.id === orderId);
    if (!orderExists) {
      navigate('/', { replace: true });
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-xl mx-auto text-center pt-24 px-4 pb-20">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }} className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
        <Check weight="bold" className="text-5xl" />
      </motion.div>
      <h2 className="text-3xl font-bold font-head mb-2 text-gray-900 dark:text-white">تم إرسال الطلب بنجاح!</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">شكراً لثقتك بنا وبمنصة وزاري</p>

      <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl mb-8 max-w-sm mx-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">كود الطلب الخاص بك:</p>
        <div className="text-2xl font-black tracking-wider text-primary">{orderId}</div>
        <p className="text-xs text-gray-400 mt-3">يُرجى الاحتفاظ بهذا الكود لمراجعة حالة الطلب.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={() => navigate('/orders')} className="px-8 py-3 bg-primary hover:bg-primaryHover text-white shadow-lg shadow-primary/20 rounded-xl transition font-bold flex items-center justify-center gap-2">
          الذهاب لطلباتي <ListChecks weight="bold" />
        </button>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 rounded-xl transition font-bold dark:text-white text-gray-800">
          العودة للرئيسية
        </button>
      </div>
    </motion.div>
  );
};

export default SuccessPage;