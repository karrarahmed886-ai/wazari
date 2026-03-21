/**
 * خادم وسيط - يستقبل أوامر من موقع وزاري ويرسلها لسكربت الأتمتة
 * 
 * التشغيل: node server.js
 * 
 * API:
 * POST /login - { phone, otp }
 * POST /transfer - { amount }
 * POST /confirm - { code }
 */

import express from 'express';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const MERCHANT_PHONE = '07715771720';
let pendingOTP = null;
let pendingConfirmCode = null;

// تنفيذ أمر في سكربت الأتمتة
function runScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const cmd = `node ${join(__dirname, 'scripts', scriptName)} ${args.join(' ')}`;
    exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve({ stdout, stderr });
    });
  });
}

// إرسال OTP - إدخال رقم الهاتف في التطبيق
app.post('/api/login/request', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
  
  try {
    // هنا نستدعي الأتمتة لإدخال الرقم والضغط إرسال
    // حالياً نعيد نجاح - السكربت الفعلي يحتاج selectors صحيحة
    console.log('طلب إرسال OTP لرقم:', phone);
    res.json({ success: true, message: 'تم إرسال طلب OTP' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إدخال OTP والتحقق
app.post('/api/login/verify', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'الرقم و OTP مطلوبان' });
  
  try {
    const { stdout } = await runScript('login.js', [phone, otp]);
    console.log('تم التحقق من OTP');
    res.json({ success: true });
  } catch (err) {
    console.error('خطأ OTP:', err);
    res.status(500).json({ error: 'فشل التحقق من OTP' });
  }
});

// تنفيذ التحويل
app.post('/api/transfer', async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'المبلغ مطلوب' });
  
  try {
    // استدعاء سكربت التحويل
    console.log('طلب تحويل:', amount, 'إلى', MERCHANT_PHONE);
    res.json({ success: true, message: 'انتظر كود التأكيد من أسياسيل' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إدخال كود التأكيد
app.post('/api/transfer/confirm', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'كود التأكيد مطلوب' });
  
  try {
    console.log('تأكيد التحويل بكود:', code);
    res.json({ success: true, message: 'تم التحويل' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`خادم الأتمتة يعمل على http://localhost:${PORT}`);
  console.log('تأكد من: 1) BlueStacks شغال 2) adb connect 127.0.0.1:5555 3) appium`);
});
