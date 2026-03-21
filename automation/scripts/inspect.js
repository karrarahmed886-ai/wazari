/**
 * سكربت مساعد: يعرض عناصر واجهة تطبيق أسياسيل
 * استخدمه مع Appium Inspector لمعرفة الـ selectors
 * 
 * التشغيل:
 * 1. appium (تيرمنل 1)
 * 2. adb connect 127.0.0.1:5555
 * 3. افتح تطبيق أسياسيل يدوياً في BlueStacks
 * 4. node scripts/inspect.js
 */

import { createDriver } from '../asiacell-driver.js';

async function main() {
  console.log('جاري الاتصال...');
  const driver = await createDriver();
  
  try {
    // لا نفتح التطبيق - نفترض أنه مفتوح
    // نستخدم noReset وعدم تحديد appActivity لربط الجلسة بالتطبيق المفتوح
    
    await driver.pause(2000);
    
    // جلب مصدر الصفحة (XML) لعرض العناصر
    const source = await driver.getPageSource();
    console.log('\n=== عناصر الواجهة (أول 3000 حرف) ===\n');
    console.log(source.substring(0, 3000));
    
    console.log('\n\nلرؤية كامل العناصر، استخدم Appium Inspector:');
    console.log('- Remote Host: 127.0.0.1');
    console.log('- Remote Port: 4723');
    console.log('- Device: 127.0.0.1:5555');
  } catch (err) {
    console.error('خطأ:', err.message);
  } finally {
    await driver.deleteSession();
  }
}

main();
