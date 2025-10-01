import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, MessageCircle, Clock, Home, HelpCircle } from "lucide-react";
import SecurityProtection from "./SecurityProtection";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  if (!orderId) {
    navigate('/');
    return null;
  }

  const handleNeedHelp = () => {
    window.open('https://t.me/kahrkm', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center px-4 transition-colors duration-300">
      <SecurityProtection />
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 animate-fadeInUp">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-bounceIn">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            تم إرسال طلبك بنجاح! ✅
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            شكراً لك على ثقتك بنا. سيتم مراجعة طلبك والرد عليك قريباً.
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8 animate-slideInUp delay-200">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">رقم الطلب</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
              {orderId.slice(0, 8).toUpperCase()}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 mb-8 animate-slideInUp delay-300">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">الخطوات التالية:</h2>
            <div className="space-y-4 text-blue-800 dark:text-blue-200">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-right">
                  <p className="font-medium">مراجعة الطلب</p>
                  <p className="text-sm">سيتم مراجعة رقم كارت الرصيد والتأكد من صحته خلال دقائق</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-right">
                  <p className="font-medium">إرسال الأسئلة</p>
                  <p className="text-sm">بعد التأكيد، ستصلك جميع الأسئلة عبر التلغرام فوراً</p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-6 mb-8 border border-yellow-200 dark:border-yellow-700 animate-slideInUp delay-400">
            <div className="flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h3 className="font-bold text-yellow-800 dark:text-yellow-200">هل تحتاج مساعدة؟</h3>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
              إذا لم تصلك الأسئلة خلال ساعة، يمكنك التواصل معنا مباشرة
            </p>
            <button
              onClick={handleNeedHelp}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              تواصل للمساعدة 📞
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slideInUp delay-500">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
              data-testid="go-home"
            >
              <Home className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </button>
            
            <button
              onClick={() => window.open('https://t.me/SS_5XN', '_blank')}
              className="flex-1 bg-white dark:bg-gray-700 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 py-3 px-6 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
              data-testid="contact-telegram"
            >
              <MessageCircle className="w-5 h-5" />
              <span>قناتنا الرسمية</span>
            </button>
          </div>

          {/* Thank You Message */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 animate-fadeInUp delay-600">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              نشكرك على اختيار موقع الأسئلة الوزارية - نتمنى لك التوفيق في امتحاناتك! 🎓
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
              بإشراف الأستاذ كرار فاضل
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;