import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, User, TelegramLogo, WhatsappLogo, ChatCircleDots, SimCard, Plus, X, Check } from '@phosphor-icons/react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import AppleEmoji from '@/components/ui/AppleEmoji';
import { gradeSubjects } from '@/data/grades';
import { usePrices } from '@/hooks/usePrices';

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

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const grade = params.get('grade');
  const subsStr = params.get('subs');
  const { prices, loading: pricesLoading } = usePrices();

  let subjectsList = [];
  try { subjectsList = JSON.parse(decodeURIComponent(subsStr)); } catch (e) {}

  const gradeSubjectsList = gradeSubjects[grade] || [];
  const validSelectedSubjects = Array.isArray(subjectsList)
    ? subjectsList.filter((s) => gradeSubjectsList.includes(s))
    : [];
  const isAllSubjects = Array.isArray(subjectsList)
    && (subjectsList.includes('جميع المواد') || (gradeSubjectsList.length > 0 && validSelectedSubjects.length === gradeSubjectsList.length));
  const finalSubjects = isAllSubjects ? gradeSubjectsList : validSelectedSubjects;
  const calculatedTotal = isAllSubjects ? prices.all_price : finalSubjects.length * prices.single_price;

  const [formData, setFormData] = useState({ name: '', contactMethod: 'telegram', contactId: '@', asiacellCards: [''] });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactError, setContactError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!grade || gradeSubjectsList.length === 0 || finalSubjects.length === 0) {
      navigate('/', { replace: true });
    }
  }, [grade, gradeSubjectsList.length, finalSubjects.length, navigate]);

  useEffect(() => {
    if (showConfirmModal) {
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showConfirmModal]);

  const validateAsiacell = (val) => {
    const clean = val.replace(/\D/g, '');
    return clean.length >= 12 && clean.length <= 16;
  };

  const validateContact = () => {
    const { contactMethod, contactId } = formData;
    if (contactMethod === 'whatsapp') {
      const clean = contactId.replace(/\D/g, '');
      return clean.startsWith('07') && clean.length === 11;
    } else if (contactMethod === 'telegram') {
      return /^[a-zA-Z0-9_]{5,32}$/.test(contactId.replace('@', ''));
    } else if (contactMethod === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactId);
    }
    return false;
  };

  const handleAddCard = () => {
    setFormData({ ...formData, asiacellCards: [...formData.asiacellCards, ''] });
  };

  const handleRemoveCard = (index) => {
    const newCards = [...formData.asiacellCards];
    newCards.splice(index, 1);
    setFormData({ ...formData, asiacellCards: newCards });
  };

  const handleCardChange = (index, value) => {
    const numericValue = value.replace(/\D/g, '');
    const newCards = [...formData.asiacellCards];
    newCards[index] = numericValue;
    setFormData({ ...formData, asiacellCards: newCards });
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();

    if (pricesLoading) {
      alert("جاري تحميل الأسعار، يرجى الانتظار قليلاً.");
      return;
    }
    
    if (!validateContact()) {
      alert("يرجى إدخال معلومات التواصل بشكل صحيح حسب الطريقة المختارة.");
      return;
    }

    if (!agreedToTerms) {
      alert("يجب الموافقة على سياسة الخصوصية وشروط الاستخدام وسياسة التعويض لإتمام الطلب.");
      return;
    }

    const invalidCards = formData.asiacellCards.filter(card => !validateAsiacell(card));
    if (invalidCards.length > 0) {
      alert("عذراً، يجب أن يكون رقم كل كارت من 12 إلى 16 رقم.");
      return;
    }

    if (formData.asiacellCards.some(card => card.trim() === '')) {
      alert("يوجد حقل كارت فارغ، يرجى تعبئته أو حذفه.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const orderId = "ORD-" + uuidv4().split('-')[0].toUpperCase();
    
    const contactMethodLabel = formData.contactMethod === 'whatsapp' ? 'واتساب' : formData.contactMethod === 'telegram' ? 'تليجرام' : 'إيميل';
    const cardsText = formData.asiacellCards.map((card, i) => `كارت ${i+1}: ${card}`).join('\n');

    const message = `
🔔 طلب جديد من منصة وزاري!
👤 الاسم: ${formData.name}
📱 التواصل (${contactMethodLabel}): ${formData.contactId}
💳 كروت الرصيد:
${cardsText}
🎓 الصف: ${grade}
📚 المواد: ${isAllSubjects ? 'جميع المواد' : finalSubjects.join('، ')}
💰 الإجمالي: ${calculatedTotal}$
🧾 رقم الطلب: ${orderId}
    `.trim();

    // 1) Save order first (critical path)
    const { error: insertError } = await supabase.from('orders').insert({
      order_id: orderId,
      name: formData.name,
      contact_method: formData.contactMethod,
      contact_id: formData.contactId,
      grade,
      subjects: isAllSubjects ? ['جميع المواد'] : finalSubjects,
      total: calculatedTotal + '$',
      cards: formData.asiacellCards,
      status: 'قيد المراجعة'
    });

    if (insertError) {
      console.error("Error saving order to Supabase:", insertError);
      alert("تعذر حفظ الطلب. يرجى المحاولة مرة أخرى.");
      setIsSubmitting(false);
      return;
    }

    // 2) Send Telegram directly from frontend (legacy flow)
    const telegramToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChatId) {
      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramChatId, text: message }),
        });
      } catch (notifyErr) {
        console.error("Telegram send failed:", notifyErr);
      }
    }

    const existingOrders = JSON.parse(localStorage.getItem('wazari_orders') || '[]');
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('ar-IQ'),
      grade,
      subjects: isAllSubjects ? ['جميع المواد'] : finalSubjects,
      total: calculatedTotal + '$',
      status: 'قيد المراجعة'
    };
    localStorage.setItem('wazari_orders', JSON.stringify([newOrder, ...existingOrders]));

    setIsSubmitting(false);
    setShowConfirmModal(false);
    navigate(`/success?id=${orderId}`);
  };

  const handleContactChange = (value) => {
    setContactError('');
    if (formData.contactMethod === 'telegram') {
      const hasArabic = /[\u0600-\u06FF]/.test(value);
      if (hasArabic) {
        setContactError('يرجى كتابة المعرف باللغة الإنجليزية');
        return;
      }
      let v = value.replace(/[^a-zA-Z0-9_@]/g, '');
      if (!v.startsWith('@')) v = '@' + v.replace(/^@+/, '');
      v = '@' + v.slice(1).replace(/@/g, '');
      setFormData({ ...formData, contactId: v || '@' });
    } else if (formData.contactMethod === 'whatsapp') {
      const hasArabic = /[\u0600-\u06FF]/.test(value);
      const hasEnglish = /[a-zA-Z]/.test(value);
      if (hasArabic || hasEnglish) {
        setContactError('يرجى كتابة رقمك الخاص بشكل صحيح');
        return;
      }
      const digits = value.replace(/\D/g, '');
      let result = digits.startsWith('07') ? digits : digits.startsWith('7') ? '07' + digits.slice(1) : '07' + digits;
      if (result.length < 2) result = '07';
      setFormData({ ...formData, contactId: result });
    } else {
      const hasArabic = /[\u0600-\u06FF]/.test(value);
      if (hasArabic) {
        setContactError('يرجى كتابة الإيميل باللغة الإنجليزية');
        return;
      }
      setFormData({ ...formData, contactId: value });
    }
  };

  const getContactPlaceholder = () => {
    if (formData.contactMethod === 'whatsapp') return '07701234567';
    if (formData.contactMethod === 'telegram') return 'أدخل المعرف (مثال: ali_123)';
    return 'example@email.com';
  };

  const getContactMessage = () => {
    if (formData.contactMethod === 'whatsapp') return 'سنرسل لك الأسئلة عبر الواتساب';
    if (formData.contactMethod === 'telegram') return 'سنرسل لك الأسئلة عبر التليجرام';
    return 'سنرسل لك الأسئلة عبر الإيميل';
  };

  return (
    <>
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-6xl mx-auto pt-10 px-4 pb-20 relative">
      <button onClick={() => navigate(-1)} className="absolute right-4 md:right-10 -top-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition">
        <ArrowRight weight="bold" /> رجوع
      </button>

      <div className="flex flex-col md:flex-row gap-8 mt-12">
        {/* Right Column: Order Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 order-1 md:order-2">
          {/* Order Summary */}
          <div className="glass-card p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold font-head mb-6 text-center dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">ملخص الطلب</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-500 dark:text-gray-400">الصف الدراسي:</span>
                <span className="text-gray-900 dark:text-white">{grade}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-500 dark:text-gray-400">نوع الشراء:</span>
                <span className="text-gray-900 dark:text-white">{isAllSubjects ? 'جميع المواد' : finalSubjects.length > 1 ? 'عدة مواد' : 'مادة واحدة'}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium border-b border-gray-200 dark:border-white/10 pb-4">
                <span className="text-gray-500 dark:text-gray-400">عدد المواد:</span>
                <span className="text-gray-900 dark:text-white">{finalSubjects.length} مادة</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-bold dark:text-white">المجموع:</span>
                <span className="text-2xl font-black text-primary">{calculatedTotal}$</span>
              </div>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-red-500">
              <ShieldCheck weight="fill" className="text-2xl" />
              <h3 className="font-bold text-lg">تعليمات مهمة جداً:</h3>
            </div>
            <ul className="space-y-3 text-sm text-red-900 dark:text-red-300 font-medium">
              <li className="flex items-start gap-2">
                <AppleEmoji emoji="⚠️" size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
                <span>تأكد من صحة أرقام الكروت قبل الإرسال.</span>
              </li>
              <li className="flex items-start gap-2">
                <AppleEmoji emoji="⚠️" size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
                <span>استخدم كروت رصيد آسياسيل فقط.</span>
              </li>
              <li className="flex items-start gap-2">
                <AppleEmoji emoji="⚠️" size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
                <span>سيتم التحقق من الأرقام قبل التأكيد.</span>
              </li>
              <li className="flex items-start gap-2">
                <AppleEmoji emoji="⚠️" size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
                <span>ستصلك الأسئلة فوراً بعد التأكيد.</span>
              </li>
              <li className="flex items-start gap-2 mt-4 pt-4 border-t border-red-500/20 text-red-600 dark:text-red-400 font-bold">
                <AppleEmoji emoji="❗" size={18} className="flex-shrink-0 mt-0.5" />
                <span>في حال إرسال رصيد وهمي يحق لنا حظرك من الموقع نهائياً.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Left Column: Form */}
        <div className="w-full md:w-2/3 glass-card p-6 md:p-8 rounded-2xl shadow-xl order-2 md:order-1">
          <h2 className="text-2xl font-bold font-head mb-8 dark:text-white text-center">معلومات الطلب</h2>
          
          <form onSubmit={handlePreSubmit} className="space-y-8 text-right" dir="rtl">
            
            {/* Student Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اسم الطالب <User className="inline ml-1" /></label>
              <input required autoComplete="name" type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="أدخل اسمك الكامل" className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/50 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
            </div>

            {/* Contact Method */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">طريقة التواصل المفضلة</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button type="button" onClick={() => { setFormData({...formData, contactMethod: 'telegram', contactId: '@'}); setContactError(''); }} className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${formData.contactMethod === 'telegram' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  <TelegramLogo weight={formData.contactMethod === 'telegram' ? 'fill' : 'regular'} className="text-2xl" />
                  <span className="text-xs font-bold">تليجرام</span>
                </button>
                <button type="button" onClick={() => { setFormData({...formData, contactMethod: 'whatsapp', contactId: '07'}); setContactError(''); }} className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${formData.contactMethod === 'whatsapp' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  <WhatsappLogo weight={formData.contactMethod === 'whatsapp' ? 'fill' : 'regular'} className="text-2xl" />
                  <span className="text-xs font-bold">واتساب</span>
                </button>
                <button type="button" onClick={() => { setFormData({...formData, contactMethod: 'email', contactId: ''}); setContactError(''); }} className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${formData.contactMethod === 'email' ? 'border-purple-500 bg-purple-500/10 text-purple-500' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  <ChatCircleDots weight={formData.contactMethod === 'email' ? 'fill' : 'regular'} className="text-2xl" />
                  <span className="text-xs font-bold">إيميل</span>
                </button>
              </div>

              <div className="relative">
                <input
                  required
                  type={formData.contactMethod === 'email' ? 'email' : 'text'}
                  inputMode={formData.contactMethod === 'whatsapp' ? 'numeric' : 'text'}
                  value={formData.contactId}
                  onChange={e => handleContactChange(e.target.value)}
                  placeholder={getContactPlaceholder()}
                  className={`w-full bg-black/5 dark:bg-white/5 border rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500 text-left font-sans ${contactError ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-primary/50'}`}
                  dir="ltr"
                />
              </div>
              {contactError && <p className="text-xs mt-2 font-medium text-red-500">{contactError}</p>}
              <p className={`text-xs mt-2 font-medium ${contactError ? '' : formData.contactMethod === 'whatsapp' ? 'text-green-500' : formData.contactMethod === 'telegram' ? 'text-blue-500' : 'text-purple-500'}`}>
                {contactError ? '' : getContactMessage()}
              </p>
            </div>

            {/* Cards Input */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">أرقام كروت الرصيد (آسياسيل) <SimCard className="inline ml-1" /></label>
                <button type="button" onClick={handleAddCard} className="text-xs font-bold bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition flex items-center gap-1">
                  <Plus weight="bold" /> إضافة كارت
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.asiacellCards.map((card, index) => (
                  <div key={index} className="relative flex items-center gap-2">
                    <input required type="text" value={card} onChange={e => handleCardChange(index, e.target.value)} placeholder={`أدخل رقم الكارت ${index + 1} (12-16 رقم)`} className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/50 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500 tracking-widest text-left font-bold font-sans" dir="ltr" maxLength="16" />
                    {formData.asiacellCards.length > 1 && (
                      <button type="button" onClick={() => handleRemoveCard(index)} className="w-12 h-12 flex-shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition">
                        <X weight="bold" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-red-500 mt-2 font-medium">يجب أن يتكون رقم الكارت من 12 إلى 16 رقم صحيح.</p>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md checked:bg-primary checked:border-primary transition-all cursor-pointer"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                  />
                  <Check weight="bold" className="absolute text-white opacity-0 peer-checked:opacity-100 w-3.5 h-3.5 pointer-events-none transition-opacity" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed select-none">
                  لقد قرأت ووافقت على <a href="/privacy" target="_blank" className="text-primary hover:underline">سياسة الخصوصية</a>، و <a href="/terms" target="_blank" className="text-primary hover:underline">شروط الاستخدام</a>، و <a href="/refund" target="_blank" className="text-primary hover:underline">سياسة التعويض</a>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={pricesLoading}
              className="w-full bg-[#4B5BEA] hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-95 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {pricesLoading ? 'جاري تحميل السعر...' : `تأكيد الطلب - ${calculatedTotal}$`}
            </button>
          </form>
        </div>
      </div>
    </motion.div>

    <AnimatePresence>
      {showConfirmModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-[#1E1E2E] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-white/10 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck weight="fill" className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold font-head text-gray-900 dark:text-white mb-2">تأكيد الطلب</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">راجع معلومات الطلب وتأكد من صحة أرقام الكروت</p>
            
            <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 mb-4 border border-gray-200 dark:border-white/5 space-y-3 text-right">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">الصف:</span>
                <span className="font-bold text-gray-900 dark:text-white">{grade}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">المواد المختارة:</span>
                <span className="font-bold text-gray-900 dark:text-white">{isAllSubjects ? 'جميع المواد' : finalSubjects.join('، ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">طريقة التواصل:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formData.contactMethod === 'telegram' ? 'تليجرام' : formData.contactMethod === 'whatsapp' ? 'واتساب' : 'إيميل'} - {formData.contactId}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 font-medium block mb-2">أرقام الكروت:</span>
                <div className="space-y-1 max-h-24 overflow-y-auto" dir="ltr">
                  {formData.asiacellCards.map((card, i) => (
                    <div key={i} className="text-base font-bold tracking-widest text-gray-900 dark:text-white">{card}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="w-1/2 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition">
                مراجعة الرصيد
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="w-1/2 py-3 rounded-xl font-bold text-white bg-success hover:bg-green-600 shadow-lg shadow-success/30 flex items-center justify-center gap-2 transition disabled:opacity-80">
                {isSubmitting ? 'جاري إرسال الطلب...' : 'إكمال الطلب'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default PaymentPage;