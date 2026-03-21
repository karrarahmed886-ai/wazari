@echo off
set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%
echo ANDROID_HOME = %ANDROID_HOME%
echo.
echo Starting Appium...
npx appium
echo.
echo Appium stopped. Press any key to close...
pause
