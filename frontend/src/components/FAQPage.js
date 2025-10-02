import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import SecurityProtection from "./SecurityProtection";

const FAQPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950/50 dark:to-purple-950 transition-colors duration-500">
      <SecurityProtection />
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowRight className="h-5 w-5" />
            <span>العودة للرئيسية</span>
          </button>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">الأسئلة الشائعة - الضمان و ثقتنا</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">كل ما تريد معرفته عن الخدمة</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="whitespace-pre-line leading-8 text-gray-900 dark:text-white select-none">
👤  : منو هو أ. كرار فاضل؟ وشنو هدفة؟ وشكد صارلة بالتلي؟ 🤔
ج/ أستاذ كرار فاضل يعمل لدى وزارة التربية هدفة نجاح اكبر عدد من الطلاب بأقل الجهد والتكاليف، صارلنا 3 سنين بالتلكرام نخدم الطلاب ولا مرة صار تغيير أو خلل وماقصرنا بـشي 🔥.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="whitespace-pre-line leading-8 text-gray-900 dark:text-white select-none">
👤 : شكد اسعاركم؟ وليش رخيصة؟ 🤔
ج/ الأسعار مذكورة في الباقات الحالية.
</p>
            
            <p className="whitespace-pre-line leading-8 text-gray-900 dark:text-white select-none mt-3">
الأسعار بسبب العروض الي يقدمها استاذ كرار اللي تميزة عن غيرة لكن كل ما تقترب الإمتحانات راح تغلى ف ننصح الطلاب كل ما يستعجلون كل ما سيطرت على المادة ✔️
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="whitespace-pre-line leading-8 text-gray-900 dark:text-white select-none">
👤 : شلون اكدر أثق ؟ وشنو الضمان ؟ واذا تغيرت ؟ 🤔
ج/ ما نسينا اهم شيئين، لذلك الادمنية في قناة التلغرام بين وفترة وفترة ينشرولكم دليل ثقة عبارة عن سكرين لمحادثة يوجد فيها الزبون والرصيد وسرعة استلام الاسئلة، في حال تغيير الاسئلة هنا يجي الضمان، راح توصلك الاسئلة الجديدة مباشرة في حال التغيير مع العلم لم يحدث أي تغيير أو خلل طول خدمتنا.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="whitespace-pre-line leading-8 text-gray-900 dark:text-white select-none">
👤 : فلان يكون عليكم نصابين !🤔
الكلام السلبي ومحاولة فشل الاخرين يصير للكل، لذلك ما يهمني أي شخص حجة او ماحجة اني اسوي شغلي فقط وطلابي شاهدين على مصداقيتي ✅.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="whitespace-pre-line leading-8 text-gray-900 dark:text-white select-none">
👤 : كلمة تكولها استاذ؟ 🤔
مو كل همي الفلوس، ولو بيدي انشرلكم الاسئلة مجانا بالقناة، لكن يصير تغيير وهل شيء ممنوع ف اني الي راح اتضرر بالحالتين ف ما اكدر انطي لأي طالب اسئلة مجانا، سجل رصيدك في الموقع واطلب والادمنية بخدمتك راح نعالج طلبك ونتأكد من الرصيد ويرسل الك مباشرة على طريقة التواصل المحددة وأعتمد اعتماد كامل على الاسئلة فقط. وباقين وياكم للدور الاول الثاني والثالث ⛈.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="whitespace-pre-line leading-8 text-gray-900 dark:text-white select-none">
👤 : شلون احجز؟ 🤔
اضغط هنا (ذهاب تلقائي الى الباقات) واختار صفك والمواد ✅ 
واضغط هنا للاستفسار والاسئلة فقط
            </p>
            <p className="whitespace-pre-line leading-8 text-gray-900 dark:text-white select-none mt-3">
👤 : شلون احجز؟ 🤔
اضغط العودة للرئيسية في يمين الزاوية العليا وستظهر لك الباقات
            </p>
          </div>
        </div>
      </main>

      {/* Hide sidebar toggle on this page */}
          <div className="text-center mt-6">
            <button onClick={() => { window.location.hash = '#pricing'; setTimeout(() => document.getElementById('pricing')?.scrollIntoView({behavior:'smooth', block:'start'}), 50); }} className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold select-none">
              اضغط هنا للحجز
            </button>
          </div>
      <Sidebar showToggle={false} />
    </div>
  );
};

export default FAQPage;
