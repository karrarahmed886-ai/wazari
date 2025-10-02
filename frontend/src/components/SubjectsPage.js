import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Check, ShoppingCart } from "lucide-react";
import SecurityProtection from "./SecurityProtection";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SubjectsPage = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [purchaseType, setPurchaseType] = useState("single");
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  const gradeNames = {
    "السادس ابتدائي": "السادس ابتدائي",
    "الثالث متوسط": "الثالث متوسط", 
    "السادس إعدادي - علمي": "السادس إعدادي - علمي",
    "السادس إعدادي - أدبي": "السادس إعدادي - أدبي"
  };

  useEffect(() => {
    fetchSubjects();
  }, [grade]);

  const fetchSubjects = async () => {
    try {
      const decodedGrade = decodeURIComponent(grade);
      const response = await axios.get(`${API}/subjects/${decodedGrade}`);
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const calculateTotal = () => {
    if (purchaseType === "all") return 50;
    return selectedSubjects.length * 10;
  };

  const handleProceedToCheckout = () => {
    const orderData = {
      grade: decodeURIComponent(grade),
      purchaseType,
      selectedSubjects: purchaseType === "all" ? subjects.map(s => s.id) : selectedSubjects,
      totalAmount: calculateTotal()
    };
    
    navigate('/checkout', { state: orderData });
  };

  const handlePurchaseTypeChange = (type) => {
    setPurchaseType(type);
    if (type === "all") {
      setSelectedSubjects(subjects.map(s => s.id));
    } else {
      setSelectedSubjects([]);
    }
    
    // Scroll to subjects section
    setTimeout(() => {
      const subjectsSection = document.getElementById('subjects-section');
      if (subjectsSection) {
        subjectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const subjectIcons = {
    "الرياضيات": "📐",
    "اللغة العربية": "📚",
    "اللغة الإنجليزية": "🇬🇧",
    "العلوم": "🔬",
    "الفيزياء": "⚡",
    "الكيمياء": "⚗️",
    "الأحياء": "🧬",
    "التاريخ": "📜",
    "الجغرافيا": "🌍",
    "الاجتماعيات": "🏛️",
    "الاقتصاد": "💰",
    "التربية الإسلامية": "☪️"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center transition-colors duration-300">
        <SecurityProtection />
        <div className="text-center animate-fadeInUp">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">جاري تحميل المواد...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-0"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <SecurityProtection />
      
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة للرئيسية</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الأسئلة الوزارية</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grade Title */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {gradeNames[decodeURIComponent(grade)] || decodeURIComponent(grade)}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">اختر نوع الشراء والمواد التي تحتاجها</p>
        </div>

        {/* Purchase Type Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 animate-fadeInUp delay-200">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">نوع الشراء</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => handlePurchaseTypeChange("single")}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                purchaseType === "single" 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg" 
                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              data-testid="purchase-type-single"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">مواد منفردة</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  purchaseType === "single" ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-500"
                }`}>
                  {purchaseType === "single" && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">اختر المواد التي تحتاجها فقط</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">10$ لكل مادة</p>
            </button>

            <button
              onClick={() => handlePurchaseTypeChange("all")}
              className={`p-6 rounded-xl border-2 transition-all relative transform hover:scale-105 ${
                purchaseType === "all" 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg" 
                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              data-testid="purchase-type-all"
            >
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                وفر 30$+
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">جميع المواد</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  purchaseType === "all" ? "border-green-500 bg-green-500" : "border-gray-300 dark:border-gray-500"
                }`}>
                  {purchaseType === "all" && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">جميع المواد بسعر مخفض</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">50$ للكل</p>
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        <div id="subjects-section">
          {purchaseType === "single" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 animate-fadeInUp delay-400">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">اختر المواد</h2>
                <p className="text-gray-600 dark:text-gray-300">اختر المواد التي تحتاج إليها (يمكنك اختيار أكثر من مادة)</p>
              </div>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subjects.map((subject, index) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectToggle(subject.id)}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 animate-fadeInUp ${
                      selectedSubjects.includes(subject.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    data-testid={`subject-${subject.id}`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3 transform transition-transform group-hover:scale-110">
                        {subjectIcons[subject.name] || "📖"}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">
                        {subject.name}
                      </h3>
                      <div className={`w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center transition-all ${
                        selectedSubjects.includes(subject.id) 
                          ? "border-blue-500 bg-blue-500 scale-110" 
                          : "border-gray-300 dark:border-gray-500"
                      }`}>
                        {selectedSubjects.includes(subject.id) && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {purchaseType === "all" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 animate-fadeInUp delay-400">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">جميع المواد المشمولة</h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subjects.map((subject, index) => (
                  <div
                    key={subject.id}
                    className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 animate-fadeInUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">{subjectIcons[subject.name] || "📖"}</div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">{subject.name}</h3>
                      <div className="w-6 h-6 rounded-full bg-green-500 mx-auto flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary & Checkout */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fadeInUp delay-600">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ملخص الطلب</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {purchaseType === "all" 
                  ? `جميع المواد (${subjects.length} مادة)`
                  : `${selectedSubjects.length} مادة مختارة`
                }
              </p>
            </div>
            <div className="text-center md:text-left mt-4 md:mt-0">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{calculateTotal()}$</p>
              <p className="text-gray-500 dark:text-gray-400">كارت رصيد آسياسيل</p>
            </div>
          </div>
          
          <button
            onClick={handleProceedToCheckout}
            disabled={purchaseType === "single" && selectedSubjects.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105"
            data-testid="proceed-to-checkout"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>متابعة إلى الدفع</span>
          </button>
        </div>
      </div>
      
      {/* Sidebar */}
      <Sidebar showToggle={false} />
    </div>
  );
};

export default SubjectsPage;