import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Layout Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

// UI Components
import LoadingScreen from '@/components/ui/LoadingScreen';

// Pages
import HomePage from '@/pages/HomePage';
import SubjectSelection from '@/pages/SubjectSelection';
import PaymentPage from '@/pages/PaymentPage';
import SuccessPage from '@/pages/SuccessPage';
import OrdersPage from '@/pages/OrdersPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import RefundPage from '@/pages/RefundPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

const ProtectedAdmin = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 gap-4">
        <div className="spinner"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">جاري التحقق...</p>
      </div>
    );
  }
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("جاري تحميل المنصة...");

  useEffect(() => {
    if (location.pathname === '/subject') setLoadingMessage("جاري تحميل المواد...");
    else if (location.pathname === '/') setLoadingMessage("جاري تحميل المنصة...");
    else setLoadingMessage("جاري التحميل...");

    const finishLoading = () => {
      setIsLoading(false);
      document.body.classList.add('loading-done');
    };

    if (location.pathname === '/payment' || location.pathname === '/success' || location.pathname.startsWith('/admin')) {
      finishLoading();
      prevPathRef.current = location.pathname;
      return;
    }

    // عند العودة للرئيسية - عرض فوري بدون شاشة تحميل
    if (location.pathname === '/' && prevPathRef.current !== '/') {
      finishLoading();
      prevPathRef.current = location.pathname;
      return;
    }
    prevPathRef.current = location.pathname;

    setIsLoading(true);
    document.body.classList.remove('loading-done');
    const timer = setTimeout(finishLoading, 1200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen message={loadingMessage} />}
      </AnimatePresence>
      {/* المحتوى يُرسم خلف شاشة التحميل لتفادي الـ lag */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/subject" element={<SubjectSelection />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const AppContent = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  useEffect(() => {
    const setupObserver = () => {
      const els = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        }),
        { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
      );
      els.forEach((el) => observer.observe(el));
      return observer;
    };
    
    // تأخير بسيط لضمان تحميل العناصر في DOM
    const timer = setTimeout(() => {
      const observer = setupObserver();
      
      // Fallback: إظهار العناصر التي في الشاشة فوراً في حال فشل الـ Observer
      const els = document.querySelectorAll('.reveal:not(.visible)');
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('visible');
        }
      });

      // تنظيف عند الخروج
      return () => observer?.disconnect();
    }, 600); // زيادة التأخير لـ 600ms لضمان انتهاء أنيميشن الصفحة السابقة (0.5s)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden w-full flex flex-col min-h-screen">
      <div className="bg-shape bg-primary/20 w-[400px] h-[400px] top-0 right-0"></div>
      <div className="bg-shape bg-purple-600/10 w-[500px] h-[500px] bottom-0 left-[-100px]"></div>
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} toggleSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="container mx-auto px-4 pt-24 min-h-[80vh] relative z-10 w-full flex-grow" dir="rtl">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

// Main App
function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (sidebarOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [sidebarOpen]);

  // Basic protection against casual users opening the context menu / dev tools
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (e.ctrlKey && key === 'u')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="font-sans text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
          <AppContent darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;