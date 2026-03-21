/**
 * Appium WebdriverIO - اتصال بتطبيق أسياسيل على BlueStacks
 * تأكد من تشغيل: appium (في تيرمنل منفصل)
 * وتشغيل: adb connect 127.0.0.1:5555
 */

import { remote } from 'webdriverio';
import { config } from './config.js';

export async function createDriver() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:udid': config.udid,
      'appium:appPackage': config.appPackage,
      'appium:appActivity': config.appActivity,
      'appium:noReset': true,
      'appium:fullReset': false,
    },
  });
  return driver;
}
