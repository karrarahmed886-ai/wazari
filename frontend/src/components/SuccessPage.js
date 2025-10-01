import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, MessageCircle, Clock, Home } from "lucide-react";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  if (!orderId) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            تم إرسال طلبك بنجاح!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            شكراً لك على ثقتك بنا. سيتم مراجعة طلبك قريباً.
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-sm text-gray-500 mb-2">رقم الطلب</div>
            <div className="text-2xl font-bold text-gray-900 font-mono">
              {orderId.slice(0, 8).toUpperCase()}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">الخطوات التالية:</h2>
            <div className="space-y-4 text-blue-800">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-right">
                  <p className="font-medium">مراجعة الطلب</p>
                  <p className="text-sm">سيتم مراجعة رقم كارت الرصيد والتأكد من صحته خلال دقائق</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-right">
                  <p className="font-medium">إرسال الأسئلة</p>
                  <p className="text-sm">بعد التأكيد، ستصلك جميع الأسئلة عبر التلغرام فوراً</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-yellow-50 rounded-xl p-6 mb-8 border border-yellow-200">
            <h3 className="font-bold text-yellow-800 mb-2">هل تحتاج مساعدة؟</h3>
            <p className="text-yellow-700 text-sm">
              إذا لم تصلك الأسئلة خلال ساعة، يرجى التواصل معنا عبر التلغرام
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2"
              data-testid="go-home"
            >
              <Home className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </button>
            
            <button
              onClick={() => window.open('https://t.me/YourTelegramBot', '_blank')}
              className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
              data-testid="contact-telegram"
            >
              <MessageCircle className="w-5 h-5" />
              <span>تواصل معنا</span>
            </button>
          </div>

          {/* Thank You Message */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              نشكرك على اختيار موقع الأسئلة الوزارية - نتمنى لك التوفيق في امتحاناتك! 🎓
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;