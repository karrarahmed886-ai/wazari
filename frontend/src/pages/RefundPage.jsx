import React from 'react';
import { motion } from 'framer-motion';
import { WarningCircle } from '@phosphor-icons/react';

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

const RefundPage = () => {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-3xl mx-auto pt-10 px-4 pb-20 text-right">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold font-head mb-4 dark:text-white flex items-center justify-center gap-3"><WarningCircle className="text-primary" /> سياسة التعويض</h2>
        <p className="text-gray-500 dark:text-gray-400">إخلاء المسؤولية وشروط التعويض</p>
      </div>
      <div className="glass-card p-8 rounded-2xl border border-black/5 dark:border-white/5 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>تهدف منصة وزاري لتقديم أفضل خدمة لطلابها، ولكن لتنظيم العمل نرجو الانتباه للسياسة التالية:</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">مسؤولية إدخال البيانات</h3>
        <p>الطالب هو المسؤول الأول والأخير عن صحة البيانات التي يدخلها في صفحة الطلب. يجب مراجعة المعلومات بعناية قبل تأكيد الطلب.</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">إخلاء مسؤولية المنصة</h3>
        <p>المنصة <strong>لا تتحمل أي مسؤولية</strong> عن أي خطأ في معلومات الطلب المكتوبة من قبل الطالب، مثل:</p>
        <ul className="list-disc list-inside pr-6 space-y-2">
          <li>اختيار مرحلة دراسية خاطئة.</li>
          <li>اختيار مادة خاطئة.</li>
          <li>كتابة معرف تواصل (تليكرام/واتساب) خاطئ.</li>
        </ul>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">عدم وجود تعويض</h3>
        <p>إذا أخطأ الطالب في الإدخال وتم تنفيذ الطلب بناءً على معلوماته الخاطئة، <strong>فلا يوجد أي تعويض مالي أو استبدال للأسئلة</strong>، حتى وإن كان كارت الرصيد المدخل صحيحاً. يرجى التأكد من طلبك قبل الدفع.</p>
      </div>
    </motion.div>
  );
};

export default RefundPage;