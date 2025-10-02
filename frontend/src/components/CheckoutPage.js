import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, MessageCircle, Phone, User, AlertCircle, Mail } from "lucide-react";
import SecurityProtection from "./SecurityProtection";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const [formData, setFormData] = useState({
    studentName: "",
    contactMethod: "telegram", // telegram, whatsapp, email
    contactValue: "",
    cardNumber: "",
    secondCardNumber: "",
    useSecondCard: false
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
    
    if (!formData.contactValue.trim()) {
      newErrors.contactValue = "معلومات التواصل مطلوبة";
    } else {
      // Validation based on contact method
      if (formData.contactMethod === "telegram" && !formData.contactValue.startsWith("@")) {
        if (!formData.contactValue.includes("@")) {
          newErrors.contactValue = "اسم المستخدم في التلغرام يجب أن يبدأ بـ @ أو يحتوي عليه";
        }
      } else if (formData.contactMethod === "whatsapp" && !/^07\d{9}$/.test(formData.contactValue)) {
        newErrors.contactValue = "رقم الواتساب غير صحيح (مثال: 07701234567)";
      } else if (formData.contactMethod === "email" && !/\S+@\S+\.\S+/.test(formData.contactValue)) {
        newErrors.contactValue = "عنوان الإيميل غير صحيح";
      }
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
        telegram_username: formData.contactMethod === "telegram" ? formData.contactValue : "",
        phone_number: formData.contactMethod === "whatsapp" ? formData.contactValue : "",
        email: formData.contactMethod === "email" ? formData.contactValue : "",
        contact_method: formData.contactMethod,
        contact_value: formData.contactValue,
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

  const getContactPlaceholder = () => {
    switch (formData.contactMethod) {
      case "telegram": return "@username";
      case "whatsapp": return "07701234567";
      case "email": return "example@gmail.com";
      default: return "";
    }
  };

  const getContactLabel = () => {
    switch (formData.contactMethod) {
      case "telegram": return "اسم المستخدم في التلغرام";
      case "whatsapp": return "رقم الواتساب";
      case "email": return "عنوان الإيميل";
      default: return "معلومات التواصل";
    }
  };

  const getContactIcon = () => {
    switch (formData.contactMethod) {
      case "telegram": return <MessageCircle className="w-4 h-4 inline mr-2" />;
      case "whatsapp": return <Phone className="w-4 h-4 inline mr-2" />;
      case "email": return <Mail className="w-4 h-4 inline mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <SecurityProtection />
      
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إتمام الطلب</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-fit animate-fadeInUp">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">الصف الدراسي:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderData.grade}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">نوع الشراء:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {orderData.purchaseType === "all" ? "جميع المواد" : "مواد منفردة"}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">عدد المواد:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderData.selectedSubjects.length} مادة</span>
              </div>
              
              <hr className="my-4 border-gray-200 dark:border-gray-600" />
              
              <div className="flex justify-between text-xl font-bold">
                <span className="text-gray-900 dark:text-white">المجموع:</span>
                <span className="text-blue-600 dark:text-blue-400">{orderData.totalAmount}$</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-blue-800 dark:text-blue-200 text-sm">
                  <p className="font-medium mb-1">تعليمات الدفع:</p>
                  <ul className="space-y-1">
                    <li>• استخدم كارت رصيد آسياسيل فقط</li>
                    <li>• تأكد من صحة الرقم المدخل</li>
                    <li>• سيتم التأكيد خلال دقائق</li>
                    <li>• ستصلك الأسئلة حسب طريقة التواصل المختارة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fadeInUp delay-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">معلومات الطلب</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  اسم الطالب
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
                    errors.studentName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="أدخل اسمك الكامل"
                  data-testid="student-name"
                />
                {errors.studentName && (
                  <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
                )}
              </div>

              {/* Contact Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  طريقة التواصل المفضلة
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: "telegram", contactValue: "" }))}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.contactMethod === "telegram" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">تلغرام</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: "whatsapp", contactValue: "" }))}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.contactMethod === "whatsapp" 
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Phone className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">واتساب</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: "email", contactValue: "" }))}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.contactMethod === "email" 
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" 
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Mail className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">إيميل</span>
                  </button>
                </div>
              </div>

              {/* Contact Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getContactIcon()}
                  {getContactLabel()}
                </label>
                <input
                  type="text"
                  name="contactValue"
                  value={formData.contactValue}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
                    errors.contactValue ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder={getContactPlaceholder()}
                  data-testid="contact-value"
                />
                {formData.contactMethod === "whatsapp" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">سنرسل لك الأسئلة عبر الواتساب</p>
                )}
                {formData.contactMethod === "telegram" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">سنرسل لك الأسئلة عبر التلغرام</p>
                )}
                {formData.contactMethod === "email" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">سنرسل لك الأسئلة عبر الإيميل</p>
                )}
                {errors.contactValue && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactValue}</p>
                )}
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
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