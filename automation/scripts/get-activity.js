/**
 * الحصول على الـ Activity الحالي لتطبيق أسياسيل
 * شغّل هذا بينما تطبيق أسياسيل مفتوح في BlueStacks
 * 
 * node scripts/get-activity.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  try {
    const { stdout } = await execAsync(
      'adb -s 127.0.0.1:5555 shell dumpsys window windows',
      { encoding: 'utf8', maxBuffer: 1024 * 1024 }
    );
    
    const match = stdout.match(/mCurrentFocus=Window\{[^}]+}\s+(\S+)/);
    if (match) {
      console.log('Activity الحالي:', match[1]);
      const full = match[1];
      if (full.includes('asiacell')) {
        const activity = full.split('/')[1] || full;
        console.log('\nاستخدم في config.js:');
        console.log("appActivity: '" + (activity.startsWith('.') ? activity : '.' + activity) + "'");
      }
    } else {
      console.log('لم يتم العثور على activity. تأكد أن أسياسيل مفتوح.');
    }
  } catch (err) {
    console.error('خطأ:', err.message);
    console.log('تأكد من: adb connect 127.0.0.1:5555');
  }
}

main();
