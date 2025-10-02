import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import AdminPage from "./AdminPage";

const ProtectedAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const ADMIN_PASSWORD = "aasskkll12345";
  const MAX_ATTEMPTS = 3;

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (attempts >= MAX_ATTEMPTS) {
      setError("تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً.");
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setAttempts(prev => prev + 1);
      setError(`كلمة المرور خاطئة. المحاولات المتبقية: ${MAX_ATTEMPTS - attempts - 1}`);
      setPassword("");
      
      if (attempts >= MAX_ATTEMPTS - 1) {
        setTimeout(() => {
          setAttempts(0);
        }, 300000); // Reset after 5 minutes
      }
    }
  };

  if (isAuthenticated) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fadeInUp">
          {/* Lock Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              لوحة الإدارة المحمية
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              يرجى إدخال كلمة المرور للمتابعة
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="أدخل كلمة المرور"
                  disabled={attempts >= MAX_ATTEMPTS}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!password || attempts >= MAX_ATTEMPTS}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {attempts >= MAX_ATTEMPTS ? "محجوب مؤقتاً" : "دخول"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              لوحة إدارة الأسئلة الوزارية - محمي بكلمة مرور
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedAdmin;