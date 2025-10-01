import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Check, ShoppingCart } from "lucide-react";
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

  const gradeNames = {
    "السادس ابتدائي": "السادس ابتدائي",
    "الثالث متوسط": "الثالث متوسط", 
    "السادس إعدادي": "السادس إعدادي"
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

  const handleSelectAll = () => {
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(subjects.map(s => s.id));
    }
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
    "التربية الإسلامية": "☪️"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة للرئيسية</span>
            </button>
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">الأسئلة الوزارية</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grade Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {gradeNames[decodeURIComponent(grade)] || decodeURIComponent(grade)}
          </h1>
          <p className="text-lg text-gray-600">اختر المواد التي تريد شراءها</p>
        </div>

        {/* Purchase Type Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">نوع الشراء</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setPurchaseType("single")}
              className={`p-6 rounded-xl border-2 transition-all ${
                purchaseType === "single" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              data-testid="purchase-type-single"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">مواد منفردة</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  purchaseType === "single" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                }`}>
                  {purchaseType === "single" && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
              <p className="text-gray-600 mb-2">اختر المواد التي تحتاجها فقط</p>
              <p className="text-2xl font-bold text-blue-600">10$ لكل مادة</p>
            </button>

            <button
              onClick={() => setPurchaseType("all")}
              className={`p-6 rounded-xl border-2 transition-all relative ${
                purchaseType === "all" 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              data-testid="purchase-type-all"
            >
              <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                وفر 30$+
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">جميع المواد</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  purchaseType === "all" ? "border-green-500 bg-green-500" : "border-gray-300"
                }`}>
                  {purchaseType === "all" && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
              <p className="text-gray-600 mb-2">جميع المواد بسعر مخفض</p>
              <p className="text-2xl font-bold text-green-600">50$ للكل</p>
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        {purchaseType === "single" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">اختر المواد</h2>
              <button
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-700 font-medium"
                data-testid="select-all-subjects"
              >
                {selectedSubjects.length === subjects.length ? "إلغاء الكل" : "اختيار الكل"}
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectToggle(subject.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedSubjects.includes(subject.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  data-testid={`subject-${subject.id}`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{subjectIcons[subject.name] || "📖"}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{subject.name}</h3>
                    <div className={`w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center ${
                      selectedSubjects.includes(subject.id) 
                        ? "border-blue-500 bg-blue-500" 
                        : "border-gray-300"
                    }`}>
                      {selectedSubjects.includes(subject.id) && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary & Checkout */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">ملخص الطلب</h2>
              <p className="text-gray-600">
                {purchaseType === "all" 
                  ? `جميع المواد (${subjects.length} مادة)`
                  : `${selectedSubjects.length} مادة مختارة`
                }
              </p>
            </div>
            <div className="text-left">
              <p className="text-3xl font-bold text-blue-600">{calculateTotal()}$</p>
              <p className="text-gray-500">كارت رصيد آسياسيل</p>
            </div>
          </div>
          
          <button
            onClick={handleProceedToCheckout}
            disabled={purchaseType === "single" && selectedSubjects.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all"
            data-testid="proceed-to-checkout"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>متابعة إلى الدفع</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;