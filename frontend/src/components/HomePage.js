import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Users, Star, MessageCircle, Phone, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
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

  const gradeIcons = {
    "السادس ابتدائي": "👦",
    "الثالث متوسط": "🧑‍🎓", 
    "السادس إعدادي - علمي": "🔬",
    "السادس إعدادي - أدبي": "📚"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                الأسئلة الوزارية
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button 
                onClick={() => navigate('/admin')}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                لوحة الإدارة
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900 text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400/20 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400/10 rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeInUp">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              احصل على الأسئلة الوزارية
              <Sparkles className="inline-block w-12 h-12 ml-4 text-yellow-400 animate-pulse" />
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              جميع أسئلة الامتحانات الوزارية لجميع المراحل الدراسية بأعلى جودة
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-blue-100">
              <div className="flex items-center space-x-2 animate-fadeInUp delay-200">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>جودة عالية</span>
              </div>
              <div className="flex items-center space-x-2 animate-fadeInUp delay-300">
                <Users className="h-5 w-5 text-green-400" />
                <span>آلاف الطلاب</span>
              </div>
              <div className="flex items-center space-x-2 animate-fadeInUp delay-400">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                <span>نجاح مضمون</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">الأسعار</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">اختر الباقة المناسبة لك</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-8 border border-blue-200 dark:border-blue-700 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">مادة واحدة</h3>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10$</div>
                <p className="text-blue-700 dark:text-blue-300 mb-6">كارت رصيد آسياسيل</p>
                <ul className="text-blue-800 dark:text-blue-200 space-y-2 mb-6">
                  <li>✅ مادة واحدة من اختيارك</li>
                  <li>✅ جميع الأسئلة الوزارية</li>
                  <li>✅ صور عالية الجودة</li>
                  <li>✅ إرسال فوري عبر التلغرام</li>
                </ul>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-8 border-2 border-green-300 dark:border-green-700 relative hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                  الأكثر توفيراً ⭐
                </span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">جميع المواد</h3>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">50$</div>
                <p className="text-green-700 dark:text-green-300 mb-6">كارت رصيد آسياسيل</p>
                <ul className="text-green-800 dark:text-green-200 space-y-2 mb-6">
                  <li>✅ جميع المواد للصف</li>
                  <li>✅ وفر أكثر من 30$</li>
                  <li>✅ جميع الأسئلة الوزارية</li>
                  <li>✅ صور عالية الجودة</li>
                  <li>✅ إرسال فوري عبر التلغرام</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grades Selection */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">اختر صفك الدراسي</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">اختر المرحلة الدراسية للحصول على الأسئلة</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {grades.map((grade, index) => (
              <button
                key={grade.id}
                onClick={() => handleGradeSelect(grade.value)}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                data-testid={`grade-${grade.id}`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {gradeIcons[grade.value]}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {grade.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    جميع الأسئلة الوزارية للمرحلة
                  </p>
                  <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                    ابدأ الآن
                    <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">تواصل معنا</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a
              href="https://t.me/SS_5XN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">قناة التلغرام الرسمية</span>
            </a>
            <a
              href="https://t.me/KAHRKM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">تواصل مع الأستاذ كرار فاضل</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">الأسئلة الوزارية</span>
          </div>
          <p className="text-gray-400">
            جميع الحقوق محفوظة © 2024 - موقع الأسئلة الوزارية
          </p>
          <p className="text-gray-500 text-sm mt-2">
            بإشراف الأستاذ كرار فاضل
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;