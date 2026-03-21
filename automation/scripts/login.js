/**
 * خطوة 1: إدخال رقم الهاتف وإرسال OTP
 * ثم إدخال OTP للدخول
 * 
 * استخدم Appium Inspector لمعرفة الـ resource-id أو XPath الصحيح
 * للعناصر في تطبيق أسياسيل
 */

import { createDriver } from '../asiacell-driver.js';

async function enterPhoneNumber(driver, phoneNumber) {
  // عدّل هذا الـ selector حسب تطبيق أسياسيل
  // أمثلة: resourceId, className, xpath
  const phoneInput = await driver.$('//android.widget.EditText[@resource-id="phone_input"]');
  await phoneInput.setValue(phoneNumber);
  
  const sendButton = await driver.$('//android.widget.Button[contains(@text,"إرسال") or contains(@text,"Send")]');
  await sendButton.click();
}

async function enterOTP(driver, otp) {
  const otpInput = await driver.$('//android.widget.EditText');
  await otpInput.setValue(otp);
  
  const loginButton = await driver.$('//android.widget.Button[contains(@text,"تسجيل") or contains(@text,"Login")]');
  await loginButton.click();
}

async function main() {
  const phone = process.argv[2] || '07701234567';
  const otp = process.argv[3] || '123456';
  
  console.log('جاري الاتصال...');
  const driver = await createDriver();
  
  try {
    console.log('إدخال رقم الهاتف:', phone);
    await enterPhoneNumber(driver, phone);
    await driver.pause(3000);
    
    console.log('إدخال OTP:', otp);
    await enterOTP(driver, otp);
    await driver.pause(3000);
    
    console.log('تم! تحقق من التطبيق.');
  } catch (err) {
    console.error('خطأ:', err.message);
    console.log('\nاستخدم Appium Inspector لمعرفة الـ selectors الصحيحة.');
  } finally {
    await driver.deleteSession();
  }
}

main();
