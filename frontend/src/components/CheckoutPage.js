import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, MessageCircle, Phone, User, AlertCircle } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const [formData, setFormData] = useState({
    studentName: "",
    telegramUsername: "",
    phoneNumber: "",
    cardNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!orderData) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "الاسم مطلوب";
    }
    
    if (!formData.telegramUsername.trim()) {
      newErrors.telegramUsername = "اسم المستخدم في التلغرام مطلوب";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب";
    } else if (!/^07\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "رقم الهاتف غير صحيح (مثال: 07701234567)";
    }
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "رقم كارت الرصيد مطلوب";
    } else if (!/^\d{12,16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "رقم الكارت غير صحيح (12-16 رقم)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderPayload = {
        student_name: formData.studentName,
        telegram_username: formData.telegramUsername,
        phone_number: formData.phoneNumber,
        grade: orderData.grade,
        purchase_type: orderData.purchaseType,
        selected_subjects: orderData.selectedSubjects,
        card_number: formData.cardNumber.replace(/\s/g, "")
      };

      const response = await axios.post(`${API}/orders`, orderPayload);
      
      navigate('/success', { state: { orderId: response.data.id } });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">إتمام الطلب</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">الصف الدراسي:</span>
                <span className="font-medium">{orderData.grade}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">نوع الشراء:</span>
                <span className="font-medium">
                  {orderData.purchaseType === "all" ? "جميع المواد" : "مواد منفردة"}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">عدد المواد:</span>
                <span className="font-medium">{orderData.selectedSubjects.length} مادة</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-xl font-bold">
                <span>المجموع:</span>
                <span className="text-blue-600">{orderData.totalAmount}$</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-blue-800 text-sm">
                  <p className="font-medium mb-1">تعليمات الدفع:</p>
                  <ul className="space-y-1">
                    <li>• استخدم كارت رصيد آسياسيل فقط</li>
                    <li>• تأكد من صحة الرقم المدخل</li>
                    <li>• سيتم التأكيد خلال دقائق</li>
                    <li>• ستصلك الأسئلة عبر التلغرام</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الطلب</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  اسم الطالب
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.studentName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل اسمك الكامل"
                  data-testid="student-name"
                />
                {errors.studentName && (
                  <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
                )}
              </div>

              {/* Telegram Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  اسم المستخدم في التلغرام
                </label>
                <input
                  type="text"
                  name="telegramUsername"
                  value={formData.telegramUsername}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.telegramUsername ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="@username (بدون @)"
                  data-testid="telegram-username"
                />
                {errors.telegramUsername && (
                  <p className="text-red-500 text-sm mt-1">{errors.telegramUsername}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  رقم الواتساب
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="07701234567"
                  data-testid="phone-number"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">اكتب رقمك في الواتساب</p>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  رقم كارت الرصيد (آسياسيل)
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formatCardNumber(formData.cardNumber)}
                  onChange={(e) => {
                    const numbers = e.target.value.replace(/\D/g, "");
                    if (numbers.length <= 16) {
                      handleInputChange({ target: { name: "cardNumber", value: numbers } });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  data-testid="card-number"
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                data-testid="submit-order"
              >
                {loading ? "جاري الإرسال..." : `تأكيد الطلب - ${orderData.totalAmount}$`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;