import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenText } from '@phosphor-icons/react';

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

const TermsPage = () => {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-3xl mx-auto pt-10 px-4 pb-20 text-right">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold font-head mb-4 dark:text-white flex items-center justify-center gap-3"><BookOpenText className="text-primary" /> شروط الاستخدام</h2>
        <p className="text-gray-500 dark:text-gray-400">القواعد المنظمة لاستخدام منصة وزاري</p>
      </div>
      <div className="glass-card p-8 rounded-2xl border border-black/5 dark:border-white/5 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>باستخدامك لمنصة وزاري، فإنك توافق على الالتزام بالشروط والأحكام التالية:</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">1. صحة المعلومات</h3>
        <p>يجب على الطالب إدخال معلومات صحيحة ودقيقة عند تقديم الطلب، ويشمل ذلك وسيلة التواصل (تليكرام أو واتساب) لضمان وصول الأسئلة بشكل صحيح.</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">2. كروت الرصيد (الدفع)</h3>
        <p>يجب أن تكون كروت رصيد أسياسيل المدخلة <strong>صالحة وغير مستخدمة سابقاً</strong>. إدخال كروت وهمية أو مستخدمة سيؤدي إلى رفض الطلب فوراً.</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">3. حقوق المنصة والجزاءات</h3>
        <ul className="list-disc list-inside pr-6 space-y-2">
          <li>في حال إدخال معلومات وهمية أو محاولة الاحتيال بكروت مستخدمة، سيتم <strong>إلغاء الطلب فوراً</strong> ولن يتم معالجته.</li>
          <li>للمنصة <strong>الحق الكامل في إلغاء، تأكيد، أو تعديل أي طلب</strong> بناءً على ما تراه مناسباً لضمان سير العمل.</li>
          <li>تحتفظ المنصة <strong>بالحق في الاحتفاظ بالمال المرسل</strong> في حال ثبوت مخالفة الشروط أو محاولة التلاعب بالنظام.</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default TermsPage;