import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Plus } from '@phosphor-icons/react';
import { usePrices } from '@/hooks/usePrices';
import { useSubjectCompletion } from '@/hooks/useSubjectCompletion';
import { gradeSubjects } from '@/data/grades';

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

const SubjectSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSubs, setSelectedSubs] = useState([]);
  const params = new URLSearchParams(location.search);
  const grade = params.get('grade');
  const { prices, loading: pricesLoading } = usePrices();
  const { completed } = useSubjectCompletion(grade);

  const toggleSubject = (sub) => {
    if (completed.has(sub)) return;
    setSelectedSubs(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const totalPrice = selectedSubs.length * prices.single_price;

  const handleProceed = () => {
    if (pricesLoading) return;
    if (selectedSubs.length === 0) return;
    const isAllSelected = selectedSubs.length === subjects.filter(sub => !completed.has(sub)).length && selectedSubs.length > 1;
    const items = encodeURIComponent(JSON.stringify(isAllSelected ? ["جميع المواد"] : selectedSubs));
    navigate(`/payment?grade=${encodeURIComponent(grade)}&subs=${items}`);
  };

  const subjects = gradeSubjects[grade] || [];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-4xl mx-auto text-center pt-10 px-4 pb-20 relative">
      <button onClick={() => navigate('/')} className="absolute right-4 md:right-10 -top-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition">
        <ArrowRight weight="bold" /> العودة للرئيسية
      </button>
      <h2 className="text-3xl md:text-4xl font-bold font-head mb-4 dark:text-white mt-12">اختر المواد</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-2">حدد كم مادة ترغب بالاشتراك بها لصف <strong>{grade}</strong></p>
      <p className="text-primary font-bold text-sm mb-10">يمكنك اختيار أكثر من مادة ({prices.single_price}$ لكل مادة)</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-right">
        {subjects.map((sub, i) => {
          const isCompleted = completed.has(sub);
          const isSelected = selectedSubs.includes(sub);
          return (
            <motion.button
              whileTap={isCompleted ? undefined : { scale: 0.95 }}
              key={i}
              onClick={() => toggleSubject(sub)}
              disabled={isCompleted}
              className={`glass-card p-4 rounded-xl font-bold transition flex items-center justify-between
                        ${isCompleted ? 'opacity-60 cursor-not-allowed border-gray-300 dark:border-gray-600' : ''}
                        ${isSelected ? 'bg-primary/20 dark:bg-primary/40 border-primary ring-2 ring-primary/50 text-primary dark:text-white' : !isCompleted ? 'border-black/5 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 text-gray-700 dark:text-white' : ''}`}>
              <span className={isCompleted ? 'line-through' : ''}>{sub}</span>
              {isCompleted ? <span className="text-xs text-red-500 dark:text-red-400">تم</span> : (isSelected ? <Check weight="bold" className="text-primary dark:text-white text-xl" /> : <Plus weight="bold" className="text-gray-400" />)}
            </motion.button>
          )
        })}
      </div>

      {/* Divider and All Subjects Button */}
      <div className="mt-12 mb-8">
        <hr className="border-t border-gray-200 dark:border-white/10 w-1/2 mx-auto mb-8" />
        <button 
          onClick={() => {
            if (pricesLoading) return;
            // Select all available subjects that are not completed
            const allAvailable = subjects.filter(sub => !completed.has(sub));
            setSelectedSubs(allAvailable);
          }}
          disabled={pricesLoading}
          className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 py-4 px-8 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 mx-auto shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 active:scale-95"
        >
          {pricesLoading ? 'جاري تحميل السعر...' : `أو حدد جميع المواد بـ ${prices.all_price}$ فقط - لفترة محدودة`}
        </button>
      </div>

      <AnimatePresence>
        {selectedSubs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="mt-12 bg-black/5 dark:bg-white/5 p-6 rounded-2xl max-w-md mx-auto border border-black/10 dark:border-white/10 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700 dark:text-gray-300 font-bold">المواد المحددة ({selectedSubs.length})</span>
              <div className="flex items-center gap-3">
                {selectedSubs.length === subjects.filter(sub => !completed.has(sub)).length && selectedSubs.length > 1 ? (
                  <>
                    <span className="text-xl font-medium text-gray-400 dark:text-gray-500 line-through">{totalPrice}$</span>
                    <span className="text-3xl font-black text-yellow-500">{prices.all_price}$</span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-primary">{totalPrice}$</span>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                if (pricesLoading) return;
                if (selectedSubs.length === 0) return;
                const isAllSelected = selectedSubs.length === subjects.filter(sub => !completed.has(sub)).length && selectedSubs.length > 1;
                const items = encodeURIComponent(JSON.stringify(isAllSelected ? ["جميع المواد"] : selectedSubs));
                navigate(`/payment?grade=${encodeURIComponent(grade)}&subs=${items}`);
              }} 
              disabled={pricesLoading}
              className={`w-full text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 ${
                selectedSubs.length === subjects.filter(sub => !completed.has(sub)).length && selectedSubs.length > 1
                  ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/30 text-gray-900'
                  : 'bg-primary hover:bg-primaryHover shadow-primary/30'
              } ${pricesLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {pricesLoading ? 'جاري تحميل السعر...' : <>تأكيد وإتمام الدفع <ArrowRight weight="bold" className="rotate-180" /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubjectSelection;