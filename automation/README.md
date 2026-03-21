# أتمتة أسياسيل - منصة وزاري

سكربت Appium للتحكم بتطبيق أسياسيل على BlueStacks.

## المتطلبات

- BlueStacks مع تطبيق أسياسيل (مسجل دخول)
- Node.js
- Appium (`npm install -g appium`)
- ADB في PATH

## التشغيل

### 1. تشغيل BlueStacks وأسياسيل
افتح BlueStacks وسجّل دخولك في تطبيق أسياسيل.

### 2. الاتصال
```powershell
adb connect 127.0.0.1:5555
adb devices
```

### 3. تشغيل Appium
```powershell
appium
```
اترك التيرمنل مفتوحاً.

### 4. تثبيت التبعيات
```powershell
cd automation
npm install
```

### 5. معرفة عناصر التطبيق (مهم)
استخدم **Appium Inspector** لمعرفة الـ selectors الصحيحة:
- حمّل من: https://github.com/appium/appium-inspector/releases
- Remote Host: 127.0.0.1
- Remote Port: 4723
- في Desired Capabilities أضف:
  - platformName: Android
  - appium:udid: 127.0.0.1:5555
  - appium:appPackage: com.asiacell.asiacellodp
- اضغط Start Session
- انقر على العناصر لرؤية resource-id و XPath

### 6. تحديث السكربتات
عدّل الملفات في `scripts/` بالـ selectors الصحيحة من Appium Inspector.

### 7. تشغيل الخادم
```powershell
node server.js
```

## هيكل الملفات

- `config.js` - الإعدادات
- `asiacell-driver.js` - اتصال Appium
- `scripts/login.js` - إدخال رقم و OTP
- `scripts/inspect.js` - عرض عناصر الواجهة
- `server.js` - خادم API للتواصل مع الموقع

## الحصول على appActivity الصحيح

```powershell
adb -s 127.0.0.1:5555 shell dumpsys window | findstr mCurrentFocus
```

عند فتح تطبيق أسياسيل، سيظهر شيء مثل:
`mCurrentFocus=Window{... com.asiacell.asiacellodp/.MainActivity}`

عدّل `config.js` بالـ activity الصحيح.
