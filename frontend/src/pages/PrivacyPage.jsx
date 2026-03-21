import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from '@phosphor-icons/react';

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

const PrivacyPage = () => {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-3xl mx-auto pt-10 px-4 pb-20 text-right">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold font-head mb-4 dark:text-white flex items-center justify-center gap-3"><ShieldCheck className="text-primary" /> سياسة الخصوصية</h2>
        <p className="text-gray-500 dark:text-gray-400">نحن نهتم بخصوصيتك وأمان معلوماتك</p>
      </div>
      <div className="glass-card p-8 rounded-2xl border border-black/5 dark:border-white/5 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>في منصة وزاري، نعتبر خصوصية طلابنا وأمان معلوماتهم من أهم أولوياتنا. نحن نلتزم بحماية بياناتك الشخصية وتوفير بيئة آمنة لطلب الأسئلة الوزارية.</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">تشفير المعلومات</h3>
        <p>جميع المعلومات التي تقوم بإدخالها أثناء عملية الطلب، بما في ذلك:</p>
        <ul className="list-disc list-inside pr-6 space-y-2">
          <li>الاسم ورقم الهاتف</li>
          <li>معرف التليكرام أو الواتساب</li>
          <li>أكواد كروت الرصيد (أسياسيل)</li>
        </ul>
        <p>يتم إرسالها وتخزينها بشكل <strong>مشفر بالكامل (End-to-End Encryption)</strong>. لا يمكن لأي طرف ثالث الوصول إلى هذه المعلومات، ويقتصر الوصول إليها فقط على الإدارة لمعالجة طلبك.</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">استخدام البيانات</h3>
        <p>نحن نستخدم بياناتك فقط لغرض إتمام طلبك وإرسال الأسئلة إليك عبر وسيلة التواصل التي اخترتها. لا نقوم ببيع أو مشاركة معلوماتك مع أي جهة خارجية تحت أي ظرف.</p>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;