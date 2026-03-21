import React from 'react';

const Footer = () => (
  <footer className="border-t border-gray-200 dark:border-white/5 py-8 mt-10 bg-white/50 dark:bg-black/20 backdrop-blur-md">
    <div className="container mx-auto px-4 text-center">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 text-sm font-medium">
        <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">سياسة الخصوصية</a>
        <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">شروط الاستخدام</a>
        <a href="/refund" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">سياسة التعويض</a>
      </div>
      <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-500 mb-2">
        <span>جميع الحقوق محفوظة &copy; 2026 - منصة وزاري</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center justify-center">
        تتمنى لجميع الطلاب التوفيق والنجاح في مسيرتهم التعليمية
      </p>
    </div>
  </footer>
);

export default Footer;