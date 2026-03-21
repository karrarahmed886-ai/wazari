/**
 * إعدادات أتمتة أسياسيل
 * عدّل القيم حسب بيئتك
 */

export const config = {
  // عنوان BlueStacks عبر ADB
  deviceUrl: 'http://127.0.0.1:4723',
  
  // معرف الجهاز - BlueStacks (تحقق من الإعدادات: 5555 أو 5556)
  udid: '127.0.0.1:5555',
  
  // تطبيق أسياسيل
  appPackage: 'com.asiacell.asiacellodp',
  appActivity: '.presentation.main.MainActivity',
  
  // رقم استلام التحويلات
  merchantPhone: '07715771720',
  
  // مهلة الانتظار (ميلي ثانية)
  timeout: 15000,
};
