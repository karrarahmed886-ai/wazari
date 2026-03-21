import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, WarningCircle } from '@phosphor-icons/react';

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

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-xl mx-auto text-center pt-32 px-4 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
      <WarningCircle weight="fill" className="text-8xl text-red-500 mb-6 drop-shadow-lg" />
      <h2 className="text-6xl font-black font-head mb-4 text-gray-900 dark:text-white tracking-widest">404</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-bold">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
      <button onClick={() => navigate('/')} className="px-8 py-4 bg-primary hover:bg-primaryHover text-white shadow-lg shadow-primary/30 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold flex items-center justify-center gap-2 text-lg">
        العودة للرئيسية <ArrowRight weight="bold" />
      </button>
    </motion.div>
  );
};

export default NotFoundPage;