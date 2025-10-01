import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Users, Star } from "lucide-react";
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
    "السادس إعدادي": "👨‍🎓"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">الأسئلة الوزارية</h1>
            </div>
            <button 
              onClick={() => navigate('/admin')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              لوحة الإدارة
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            احصل على الأسئلة الوزارية
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            جميع أسئلة الامتحانات الوزارية لجميع المراحل الدراسية
          </p>
          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>جودة عالية</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>آلاف الطلاب</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>نجاح مضمون</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">الأسعار</h2>
            <p className="text-lg text-gray-600">اختر الباقة المناسبة لك</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">مادة واحدة</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">10$</div>
                <p className="text-blue-700 mb-6">كارت رصيد آسياسيل</p>
                <ul className="text-blue-800 space-y-2 mb-6">
                  <li>✅ مادة واحدة من اختيارك</li>
                  <li>✅ جميع الأسئلة الوزارية</li>
                  <li>✅ صور عالية الجودة</li>
                  <li>✅ إرسال فوري عبر التلغرام</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  الأكثر توفيراً
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-900 mb-4">جميع المواد</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">50$</div>
                <p className="text-green-700 mb-6">كارت رصيد آسياسيل</p>
                <ul className="text-green-800 space-y-2 mb-6">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">اختر صفك الدراسي</h2>
            <p className="text-lg text-gray-600">اختر المرحلة الدراسية للحصول على الأسئلة</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {grades.map((grade) => (
              <button
                key={grade.id}
                onClick={() => handleGradeSelect(grade.value)}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 hover:border-blue-300"
                data-testid={`grade-${grade.id}`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{gradeIcons[grade.value]}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {grade.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    جميع الأسئلة الوزارية للمرحلة
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-semibold">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">الأسئلة الوزارية</span>
          </div>
          <p className="text-gray-400">
            جميع الحقوق محفوظة © 2024 - موقع الأسئلة الوزارية
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;