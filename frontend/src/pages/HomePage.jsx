import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Star, GraduationCap, Clock, ShieldCheck, ChatCircleDots, CaretUp, CaretDown, TelegramLogo } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import AppleEmoji from '@/components/ui/AppleEmoji';
import TextWithAppleEmoji from '@/components/ui/TextWithAppleEmoji';
import RippleButton from '@/components/ui/RippleButton';
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

const DiamondIcon = ({ className = '' }) => (
  <span className={`marquee-diamond ${className}`}>
    <svg viewBox="0 0 8 8" fill="currentColor"><path d="M4 0L8 4L4 8L0 4Z" /></svg>
  </span>
);

/** شريط مميزات المنصة - CSS خالص - لا نهائي ومضبوط 100% */
const FeaturesStrip = () => {
  const items = [
    'جودة عالية', 'تسليم فوري', 'نجاح مضمون', 'آلاف الطلاب',
    'جميع الأسئلة الوزارية', 'إرسال فوري', 'دعم مجاني مدى الحياة', 'صور عالية الجودة',
  ];
  const row = items.map((t, i) => (
    <span key={i} dir="rtl" className="inline-flex items-center gap-3 text-[#8892B0] dark:text-gray-300 text-sm font-medium whitespace-nowrap px-6">
      <DiamondIcon />
      <span>{t}</span>
    </span>
  ));
  return (
    <div className="marquee-outer" dir="ltr">
      <div className="marquee-content">{row}</div>
      <div className="marquee-content">{row}</div>
      <div className="marquee-content">{row}</div>
      <div className="marquee-content">{row}</div>
      <div className="marquee-content">{row}</div>
      <div className="marquee-content">{row}</div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { prices, loading: pricesLoading } = usePrices();
  const [selectedPkg, setSelectedPkg] = useState('single');
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handlePackageClick = (pkgType) => {
    setSelectedPkg(pkgType);
    document.getElementById('grades-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const processGrade = (fullGrade) => {
    setShowBranchModal(false);
    if (selectedPkg === 'all') {
      if (pricesLoading) return;
      const items = encodeURIComponent(JSON.stringify(["جميع المواد"]));
      navigate(`/payment?grade=${encodeURIComponent(fullGrade)}&subs=${items}`);
    } else {
      navigate(`/subject?grade=${encodeURIComponent(fullGrade)}`);
    }
  };

  const handleGradeSelect = (grade) => {
    if (grade === 'السادس إعدادي') {
      setShowBranchModal(true);
    } else {
      processGrade(grade);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-5xl mx-auto pt-10 pb-20">

      {/* Branch Modal Popup */}
      <AnimatePresence>
        {showBranchModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setShowBranchModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80] overflow-hidden" />
            <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none px-4 overflow-hidden">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }} className="w-full max-w-md glass-card p-8 text-center rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl pointer-events-auto">
                <h3 className="text-2xl font-bold font-head mb-6 text-gray-900 dark:text-white">الفرع الدراسي</h3>
                <p className="text-gray-500 mb-8 font-medium">اختر الفرع العلمي أو الأدبي للسادس إعدادي</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => processGrade('السادس إعدادي - العلمي')} className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary py-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 hover:-translate-y-1">
                    <AppleEmoji emoji="🔬" size={28} className="inline-block" /> العلمي
                  </button>
                  <button onClick={() => processGrade('السادس إعدادي - الأدبي')} className="bg-purple-500/10 hover:bg-purple-500 text-purple-600 dark:text-purple-400 hover:text-white border border-purple-500 py-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 hover:-translate-y-1">
                    <AppleEmoji emoji="📚" size={28} className="inline-block" /> الأدبي
                  </button>
                </div>
                <button onClick={() => setShowBranchModal(false)} className="mt-8 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white underline font-bold">إلغاء</button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="reveal reveal-initial text-center relative mb-16 md:mb-24">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-head font-bold mb-6 text-gradient drop-shadow-md leading-tight">
          حصّل على الاسئلة الوزارية هسة!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
          <TextWithAppleEmoji text="جميع أسئلة الامتحانات الوزارية لجميع المراحل الدراسية بأعلى جودة وأسرع وقت 🏆" emojiSize={22} />
        </p>

        {/* شريط مميزات المنصة - خط لا ينتهي، يتفاعل مع اللمس */}
        <div className="mt-8 -mx-4 md:-mx-8">
          <FeaturesStrip />
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="reveal reveal-initial reveal-delay-1 text-center mb-10 mt-10 scroll-mt-28">
        <h2 className="text-3xl font-bold font-head mb-3 dark:text-white">الأسعار</h2>
        <p className="text-gray-500 dark:text-gray-400">اختر الباقة المناسبة لك (التحديد الحالي: {selectedPkg === 'single' ? 'مادة أو أكثر' : 'باقة جميع المواد'})</p>
      </div>

      <div className="reveal reveal-initial reveal-delay-2 flex flex-col md:flex-row justify-center items-stretch gap-8 mx-auto max-w-4xl px-4 md:px-0 mb-20 gap-y-12 md:gap-y-0">

        {/* Package 1: One Subject */}
        <div
          className={`glass-card rounded-2xl w-full md:w-1/2 p-8 relative flex flex-col overflow-hidden group border !border-transparent hover:!border-primary/40 dark:hover:!border-white/50 cursor-pointer animate-fadeInUp transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)] ${
            selectedPkg === 'single'
              ? 'bg-primary/5 dark:bg-primary/10'
              : ''
          }`}
          onClick={() => handlePackageClick('single')}
        >
          <div className="absolute -left-10 top-6 rotate-[315deg] bg-red-500 text-white text-xs font-bold py-1 w-[150px] text-center shadow-lg transform origin-center overflow-hidden z-20">
            لفترة محدودة <AppleEmoji emoji="🔥" size={14} className="inline-block align-middle" />
          </div>

          <div className="flex flex-col items-center mb-6 z-10">
            <div className="icon w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30 text-white">
              <AppleEmoji emoji="📕" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-1 dark:text-white">مادة واحدة</h3>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 mt-4 w-full flex flex-col items-center justify-center text-center" dir="ltr">
              <span className="inline-flex items-baseline gap-2 justify-center">
                <span className="text-xl font-medium text-gray-400 dark:text-gray-500 line-through">{prices.single_original}$</span>
                <span>{prices.single_price}$</span>
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mt-1">
                كارت رصيد أسياسيل
              </span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-grow z-10" dir="rtl">
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium tracking-wide">
              <AppleEmoji emoji="⭐" size={20} className="flex-shrink-0" />
              <span className="text-right">مادة واحدة من اختيارك</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium tracking-wide">
              <AppleEmoji emoji="⭐" size={20} className="flex-shrink-0" />
              <span className="text-right">جميع الأسئلة الوزارية</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium tracking-wide">
              <AppleEmoji emoji="⭐" size={20} className="flex-shrink-0" />
              <span className="text-right">صور عالية الجودة</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium tracking-wide">
              <AppleEmoji emoji="⚡" size={20} className="flex-shrink-0" />
              <span className="text-right">إرسال فوري</span>
            </li>
          </ul>

          <RippleButton
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 z-10 active:scale-95 ${
              selectedPkg === 'single'
                ? 'bg-[#4B5BEA] text-white shadow-primary/30 hover:bg-indigo-600'
                : 'bg-black/5 dark:bg-white/5 text-gray-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            style={{ fontFamily: 'Cairo' }}
          >
            اختر الآن <ArrowRight weight="bold" className="rotate-180" />
          </RippleButton>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 blur-[50px] rounded-full"></div>
        </div>

        {/* Package 2: All Subjects */}
        <div
          className={`glass-card rounded-2xl w-full md:w-1/2 p-8 relative flex flex-col overflow-hidden group border !border-transparent hover:!border-primary/40 dark:hover:!border-white/50 cursor-pointer animate-fadeInUp transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)]`}
          style={{ animationDelay: '120ms' }}
          onClick={() => handlePackageClick('all')}
        >
          <div className="absolute -left-10 top-6 rotate-[315deg] bg-red-500 text-white text-xs font-bold py-1 w-[150px] text-center shadow-lg transform origin-center z-20">
            الأكثر توفيراً <AppleEmoji emoji="🏆" size={14} className="inline-block align-middle" />
          </div>

          <div className="flex flex-col items-center mb-6 mt-4 z-10">
            <div className="icon w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg text-white" style={{ backgroundColor: '#FFD700', boxShadow: '0 10px 15px -3px rgba(255,215,0,0.4)' }}>
              <AppleEmoji emoji="📚" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-1 dark:text-white">جميع المواد</h3>
            <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2 mt-4 w-full flex flex-col items-center justify-center text-center" dir="ltr">
              <span className="inline-flex items-baseline gap-3 justify-center">
                <span className="text-2xl font-medium text-gray-400 dark:text-gray-500 line-through">{prices.all_original}$</span>
                <span className="text-[#FFD700] drop-shadow-md">{prices.all_price}$</span>
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                كارت رصيد أسياسيل
              </p>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-grow z-10" dir="rtl">
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap tracking-wide">
              <AppleEmoji emoji="⭐" size={20} className="flex-shrink-0" />
              <span className="text-right">جميع المواد للصف</span>
            </li>
            <li className="flex items-center justify-between bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 rounded-xl p-3 my-2">
              <div className="flex items-center gap-3 text-green-700 dark:text-green-400 font-bold tracking-wide">
                <AppleEmoji emoji="🔥" size={20} className="flex-shrink-0" />
                <span className="text-right">أكبر توفير!</span>
              </div>
              <span className="text-green-700 dark:text-green-400 font-black text-lg">وفر أكثر من 30$</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium tracking-wide">
              <AppleEmoji emoji="⭐" size={20} className="flex-shrink-0" />
              <span className="text-right">جميع الأسئلة الوزارية</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium tracking-wide">
              <AppleEmoji emoji="⭐" size={20} className="flex-shrink-0" />
              <span className="text-right">دعم مجاني مدى الحياة</span>
            </li>
          </ul>

          <RippleButton
            className="w-full py-3 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 z-10 active:scale-95 text-white hover:opacity-90 shimmer-btn"
            style={{ fontFamily: 'Cairo', backgroundColor: '#FFD700', boxShadow: '0 4px 14px rgba(255,215,0,0.4)' }}
          >
            اختر الآن <ArrowRight weight="bold" className="rotate-180" />
          </RippleButton>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 blur-[50px] rounded-full" style={{ backgroundColor: 'rgba(255,215,0,0.2)' }}></div>
        </div>
      </div>

      {/* Grades Selection Section (Placed directly below pricing) */}
      <div id="grades-section" className="reveal scroll-mt-32 max-w-4xl mx-auto pt-10 border-t border-gray-200 dark:border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-head mb-2 dark:text-white">اختر الصف الدراسي للبدء </h2>
          <p className="text-gray-500 dark:text-gray-400">حدد المرحلة لتظهر لك المواد المتوفرة بناءً على الباقة المحددة</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
          {[
            { title: 'السادس ابتدائي', icon: '👦' },
            { title: 'الثالث متوسط', icon: '👨‍🎓' },
            { title: 'السادس إعدادي', icon: '🎓' }
          ].map((g, i) => (
            <div key={i} onClick={() => handleGradeSelect(g.title)} className="glass-card p-8 rounded-2xl cursor-pointer hover:border-primary/50 group text-center flex flex-col items-center justify-between hover-lift-big animate-fadeInUp min-h-[320px]" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex flex-col items-center w-full mb-6">
                <div className="mb-6 drop-shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2"><AppleEmoji emoji={g.icon} size={56} /></div>
                <h3 className="font-bold text-xl md:text-2xl dark:text-white text-gray-900 mb-2 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-primary">{g.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium px-2 leading-relaxed">
                  جميع الأسئلة الوزارية<br />للمرحلة
                </p>
              </div>
              <button className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95">
                ابدأ الآن <ArrowRight weight="bold" className="rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Divider under grade cards */}
      <div className="max-w-4xl mx-auto mt-20 mb-4">
        <hr className="border-t-2 border-gray-200 dark:border-white/10" />
      </div>

      {/* Features Section */}
      <div className="reveal mt-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold font-head mb-2 dark:text-white">ليش تختار منصة وزاري؟</h2>
          <p className="text-gray-500 dark:text-gray-400">لأن حتحصل على المميزات التالية :</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center flex flex-col items-center p-6 rounded-2xl animate-fadeIn-035 group cursor-pointer" style={{ animationDelay: '0ms' }}>
            <div className="icon-bubble w-14 h-14 rounded-full backdrop-blur-md bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
              <ShieldCheck className="text-2xl" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white">ضمان الجودة</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">جميع الأسئلة مراجعة وموثوقة من مصادر رسمية</p>
          </div>
          <div className="text-center flex flex-col items-center p-6 rounded-2xl animate-fadeIn-035 group cursor-pointer" style={{ animationDelay: '150ms' }}>
            <div className="icon-bubble w-14 h-14 rounded-full backdrop-blur-md bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:scale-110">
              <Clock className="text-2xl" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white">تسليم سريع</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">تصلك الأسئلة فوراً بعد تأكيد الدفع</p>
          </div>
          <div className="text-center flex flex-col items-center p-6 rounded-2xl animate-fadeIn-035 group cursor-pointer" style={{ animationDelay: '300ms' }}>
            <div className="icon-bubble w-14 h-14 rounded-full backdrop-blur-md bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110">
              <ChatCircleDots className="text-2xl" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white">دعم مستمر</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">فريق دعم متاح 24/7 لمساعدتك</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto mt-20 mb-4">
        <hr className="border-t-2 border-gray-200 dark:border-white/10" />
      </div>

      {/* FAQ Section */}
      <div id="faq" className="reveal mt-16 max-w-3xl mx-auto scroll-mt-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-head mb-2 dark:text-white">الأسئلة الشائعة</h2>
          <p className="text-gray-500 dark:text-gray-400">كل ما تريد معرفته عن الخدمة</p>
        </div>
        <div className="space-y-3">
          {[
            { q: 'منو هو أ. كرار فاضل؟ وشنو هدفة؟ وشكد صارلة بالتلي؟', a: 'أستاذ كرار فاضل يعمل لدى وزارة التربية هدفة نجاح أكبر عدد من الطلاب بأقل الجهد والتكاليف، صارلنا 3 سنين بالتلكرام نخدم الطلاب ولا مرة صار تغيير أو خلل وما قصرنا بشي 🔥' },
            { q: 'شكد اسعاركم؟ وليش رخيصة؟', a: 'الأسعار مذكورة في الباقات الحالية. الأسعار بسبب العروض الي يقدمها استاذ كرار اللي تميزة عن غيرة لكن كل ما تقترب الإمتحانات راح تغلى ف ننصح الطلاب كل ما يستعجلون كل ما سيطرت على المادة ✅' },
            { q: 'شلون اكدر أثق؟ وشنو الضمان؟ واذا تغيرت؟', a: 'ما نسينا اهم شيئين، لذلك الادمنية في قناة التلغرام بين وفترة وفترة ينشرولكم دليل ثقة عبارة عن سكرين لمحادثة يوجد فيها الزبون والرصيد وسرعة استلام الاسئلة في حال تغيير الاسئلة هنا يجي الضمان، راح توصلك الاسئلة الجديدة مباشرة في حال التغيير مع العلم لم يحدث أي تغيير أو خلل طول خدمتنا.' },
            { q: 'فلان يكون عليكم نصابين!', a: 'الكلام السلبي ومحاولة فشل الآخرين يصير للكل، لذلك ما يهمني أي شخص حجة او ماحجة اني اسوي شغلي فقط وطلابي شاهدين على مصداقيتي ✅' },
            { q: 'كلمة تكولها استاذ؟', a: 'مو كل همي الفلوس، ولو بيدي انشرلكم الاسئلة مجانا بالقناة، لكن يصير تغيير وهل شيء ممنوع ف اني الي راح اتضرر بالحالتين ف ما اكدر انطي لأي طالب اسئلة مجانا، سجل رصيدك في الموقع واطلب والادمنية بخدمتك راح نعالج طلبك وتتأكد من الرصيد ويرسل الك مباشرة على طريقة التواصل المحددة واعتمد اعتماد كامل على الاسئلة فقط وباقين وياكم للدور الاول الثاني والثالث ⚖️' },
            { q: 'شلون احجز؟', a: null }
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-right hover:bg-black/5 dark:hover:bg-white/5 transition">
                <span className="font-bold text-gray-900 dark:text-white flex-1">{item.q}</span>
                {openFaq === i ? <CaretUp weight="bold" className="text-primary flex-shrink-0" /> : <CaretDown weight="bold" className="text-gray-500 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
                      {item.a ? (
                        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed"><TextWithAppleEmoji text={item.a} emojiSize={18} /></p>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                          <a href="/#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-primary font-bold hover:underline">اضغط هنا لرؤية الباقات</a>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Strip Section */}
      <div className="reveal mt-16">
        <div className="max-w-4xl mx-auto rounded-3xl glass-card px-6 py-10 md:px-10 md:py-12 text-center shadow-2xl border border-gray-200 dark:border-white/10">
          <h2 className="text-2xl md:text-3xl font-head font-bold mb-3 text-gray-900 dark:text-white">تواصل معنا</h2>
          <p className="mb-8 text-sm md:text-base text-gray-600 dark:text-gray-300">
            نحن هنا لمساعدتك في رحلتك التعليمية
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="https://t.me/SS_5XN"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white hover:bg-primaryHover px-6 py-3 text-sm md:text-base font-bold transition-all shadow-lg shadow-primary/30"
            >
              <TelegramLogo weight="fill" className="text-xl md:text-2xl" />
              <span>قناة التلغرام الرسمية</span>
            </motion.a>

            <motion.a
              href="https://t.me/kahrkm"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white text-primary hover:bg-gray-100 px-6 py-3 text-sm md:text-base font-bold transition-all shadow-md"
            >
              <TelegramLogo weight="fill" className="text-xl md:text-2xl" />
              <span>تواصل مع الأستاذ كرار فاضل</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;