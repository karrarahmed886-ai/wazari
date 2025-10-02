import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  ChevronDown,
  Users,
  ShoppingCart,
  ListChecks
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGradesMenu, setShowGradesMenu] = useState(false);
  const navigate = useNavigate();

  const grades = [
    { name: "السادس ابتدائي", value: "السادس ابتدائي", emoji: "👦🏻" },
    { name: "الثالث متوسط", value: "الثالث متوسط", emoji: "🧑🏻‍🎓" },
    { name: "السادس إعدادي - علمي", value: "السادس إعدادي - علمي", emoji: "🔬" },
    { name: "السادس إعدادي - أدبي", value: "السادس إعدادي - أدبي", emoji: "📚" }
  ];

  const handleGradeSelect = (gradeValue) => {
    navigate(`/subjects/${encodeURIComponent(gradeValue)}`);
    setIsOpen(false);
    setShowGradesMenu(false);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-colors duration-200"
        data-testid="sidebar-toggle"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">القائمة الرئيسية</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-4">
          {/* Home */}
          <button
            onClick={() => {
              navigate('/');
              setIsOpen(false);
            }}
            className="w-full flex items-center px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5 ml-3" />
            <span className="font-medium">الرئيسية</span>
          </button>

          {/* Order Now with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowGradesMenu(!showGradesMenu)}
              className="w-full flex items-center justify-between px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 ml-3" />
                <span className="font-medium">اطلب الآن</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showGradesMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Grades Submenu */}
            {showGradesMenu && (
              <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {grades.map((grade) => (
                  <button
                    key={grade.value}
                    onClick={() => handleGradeSelect(grade.value)}
                    className="w-full flex items-center px-12 py-3 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <span className="text-lg ml-2">{grade.emoji}</span>
                    <span>{grade.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowGradesMenu(false)}
              className="w-full flex items-center justify-between px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                <Phone className="w-5 h-5 ml-3" />
                <span className="font-medium">تواصل معنا</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  window.open('https://t.me/KAHRKM', '_blank');
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-12 py-3 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <span className="text-lg ml-2">👨🏻‍🏫</span>
                <span>الأستاذ كرار فاضل</span>
              </button>
              <button
                onClick={() => {
                  window.open('https://t.me/SS_5XN', '_blank');
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-12 py-3 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <span className="text-lg ml-2">📣</span>
                <span>قناتنا الرسمية</span>
              </button>
            </div>
          </div>

          {/* My Orders */}
          <button
            onClick={() => {
              navigate('/orders');
              setIsOpen(false);
            }}
            className="w-full flex items-center px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ListChecks className="w-5 h-5 ml-3" />
            <span className="font-medium">طلباتي</span>
          </button>

          {/* About Us */}
          <button
            onClick={() => {
              document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              setIsOpen(false);
            }}
            className="w-full flex items-center px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Users className="w-5 h-5 ml-3" />
            <span className="font-medium">من نحن</span>
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              موقع الأسئلة الوزارية
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              بإشراف الأستاذ كرار فاضل
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;