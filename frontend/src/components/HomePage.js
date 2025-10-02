import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Users, Star, MessageCircle, Phone, Sparkles, Award, Clock, Shield } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import FloatingChannelTab from "./FloatingChannelTab";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${API}/grades`);
      setGrades(response.data.grades);
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSelect = (gradeValue) => {
    navigate(`/subjects/${encodeURIComponent(gradeValue)}`);
  };

  const scrollToGrades = () => {
    setTimeout(() => {
      const gradesSection = document.getElementById('grades-section');
      if (gradesSection) {
        gradesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const gradeIcons = {
    "السادس ابتدائي": "👦",
    "الثالث متوسط": "🧑‍🎓", 
    "السادس إعدادي - علمي": "🔬",
    "السادس إعدادي - أدبي": "📚"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="p-4 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 dark:from-blue-500 dark:via-indigo-600 dark:to-purple-600 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="h-9 w-9 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight">
                  📚 الأسئلة الوزارية
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                    بإشراف الأستاذ كرار فاضل 🎓
                  </p>
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {/* Admin access - only visible to admin */}
              <div 
                onDoubleClick={() => navigate('/admin')}
                className="w-8 h-8 cursor-pointer opacity-0 hover:opacity-30 transition-opacity duration-300"
                title="إدارة (نقر مزدوج)"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900 text-white py-20 overflow-hidden">
        {/* Enhanced Animated background elements */}
        <div className="absolute inset-0">
          {/* Floating emojis */}
          <div className="absolute top-16 left-10 text-4xl animate-bounce delay-0">📚</div>
          <div className="absolute top-32 right-20 text-3xl animate-pulse delay-1000">⭐</div>
          <div className="absolute bottom-24 left-1/4 text-3xl animate-ping delay-500">🎓</div>
          <div className="absolute bottom-16 right-10 text-4xl animate-bounce delay-700">📖</div>
          <div className="absolute top-1/3 left-1/3 text-2xl animate-float delay-300">✨</div>
          <div className="absolute top-2/3 right-1/3 text-2xl animate-pulse delay-900">🏆</div>
          
          {/* Geometric shapes */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-white/10 to-yellow-400/20 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full animate-float"></div>
          
          {/* Sparkle effects */}
          <div className="absolute top-1/4 left-3/4 w-2 h-2 bg-white rounded-full animate-ping delay-200"></div>
          <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-800"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-400"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeInUp">
            <div className="mb-6">
              <Sparkles className="inline-block w-12 h-12 text-yellow-400 animate-pulse mb-4" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              احصل على الأسئلة الوزارية
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              جميع أسئلة الامتحانات الوزارية لجميع المراحل الدراسية بأعلى جودة وأسرع وقت
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-blue-100 mb-8">
              <div className="flex items-center space-x-2 animate-fadeInUp delay-200">
                <Star className="h-6 w-6 text-yellow-400" />
                <span className="font-medium">جودة عالية</span>
              </div>
              <div className="flex items-center space-x-2 animate-fadeInUp delay-300">
                <Users className="h-6 w-6 text-green-400" />
                <span className="font-medium">آلاف الطلاب</span>
              </div>
              <div className="flex items-center space-x-2 animate-fadeInUp delay-400">
                <Award className="h-6 w-6 text-purple-400" />
                <span className="font-medium">نجاح مضمون</span>
              </div>
              <div className="flex items-center space-x-2 animate-fadeInUp delay-500">
                <Clock className="h-6 w-6 text-orange-400" />
                <span className="font-medium">تسليم فوري</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Removed duplicate */}

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">الأسعار</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">اختر الباقة المناسبة لك</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button onClick={scrollToGrades} className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">مادة واحدة 📚</h3>
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">10$</div>
                <p className="text-blue-700 dark:text-blue-300 mb-6 font-medium">كارت رصيد آسياسيل</p>
                <ul className="text-blue-800 dark:text-blue-200 space-y-3 mb-8 text-right">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                    مادة واحدة من اختيارك
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                    جميع الأسئلة الوزارية
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                    صور عالية الجودة
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                    إرسال فوري ⚡
                  </li>
                </ul>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
                  اختر الآن 👆
                </div>
              </div>
            </button>
            
            <button onClick={scrollToGrades} className="group bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-2xl p-8 border-2 border-green-300 dark:border-green-600 relative hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg">
                  ⭐ الأكثر توفيراً ⭐
                </span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">جميع المواد 🎯</h3>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">50$</div>
                <p className="text-green-700 dark:text-green-300 mb-6 font-medium">كارت رصيد آسياسيل</p>
                <ul className="text-green-800 dark:text-green-200 space-y-3 mb-8 text-right">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                    جميع المواد للصف
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                    وفر أكثر من 30$ 💰
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                    جميع الأسئلة الوزارية
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 ml-2" />
                    دعم مجاني مدى الحياة 🎁
                  </li>
                </ul>
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">
                  اختر الآن 👆
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Grades Selection */}
      <section id="grades-section" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">اختر صفك الدراسي</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">اختر المرحلة الدراسية للحصول على الأسئلة</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {grades.map((grade, index) => (
              <button
                key={grade.id}
                onClick={() => handleGradeSelect(grade.value)}
                className="group bg-white dark:bg-gray-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 border border-gray-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 animate-fadeInUp"
                data-testid={`grade-${grade.id}`}
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {gradeIcons[grade.value]}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {grade.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                    جميع الأسئلة الوزارية للمرحلة
                  </p>
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300 transform group-hover:scale-105">
                    ابدأ الآن
                    <svg className="w-4 h-4 mr-2 inline group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">لماذا نحن الأفضل؟</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">مزايا تجعلنا الخيار الأول للطلاب</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ضمان الجودة</h3>
              <p className="text-gray-600 dark:text-gray-300">جميع الأسئلة مراجعة ومؤكدة من مصادر رسمية</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">تسليم سريع</h3>
              <p className="text-gray-600 dark:text-gray-300">تصلك الأسئلة فوراً بعد تأكيد الدفع</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">دعم مستمر</h3>
              <p className="text-gray-600 dark:text-gray-300">فريق دعم متاح 24/7 لمساعدتك</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeInUp">
            <h2 className="text-4xl font-bold mb-4">تواصل معنا</h2>
            <p className="text-xl mb-8 text-white/90">نحن هنا لمساعدتك في رحلتك التعليمية</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a
                href="https://t.me/SS_5XN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">قناة التلغرام الرسمية</span>
              </a>
              <a
                href="https://t.me/KAHRKM"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <Phone className="w-6 h-6" />
                <span className="font-semibold text-lg">تواصل مع الأستاذ كرار فاضل</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">الأسئلة الوزارية</span>
                <p className="text-gray-400 text-sm">بإشراف الأستاذ كرار فاضل</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 mb-2">
                جميع الحقوق محفوظة © 2024 - موقع الأسئلة الوزارية
              </p>
              <p className="text-gray-500 text-sm">
                نتمنى لجميع الطلاب التوفيق والنجاح في مسيرتهم التعليمية 🎓
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Channel Tab */}
      <FloatingChannelTab />
    </div>
  );
};

export default HomePage;