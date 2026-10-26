@echo off
chcp 65001 >nul
setlocal EnableExtensions
title Anatomi Rehberi - Android hata kaydi (logcat)

rem ============================================================
rem  Telefon USB ile bagliyken uygulamanin cokme kaydini alir.
rem  Telefonda: Ayarlar > Telefon hakkinda > Yapi numarasi'na 7 kez
rem  dokunun (Gelistirici secenekleri acilir), sonra Gelistirici
rem  secenekleri > USB hata ayiklama'yi acin ve USB ile baglayin.
rem ============================================================

set "PT=%LOCALAPPDATA%\anatomi-platform-tools"
set "ADB=%PT%\platform-tools\adb.exe"
set "OUT=%USERPROFILE%\Desktop\anatomi-hata-kaydi.txt"

if not exist "%ADB%" (
  echo Android araclari indiriliyor ^(yaklasik 15 MB^)...
  powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip' -OutFile '%TEMP%\platform-tools.zip'; Expand-Archive -Force '%TEMP%\platform-tools.zip' '%PT%'" || goto :fail
)

echo.
echo Telefon araniyor... Telefonda "USB hata ayiklamaya izin verilsin mi?" sorulursa IZIN VER deyin.
"%ADB%" start-server >nul 2>nul
"%ADB%" wait-for-device
for /f "tokens=*" %%m in ('"%ADB%" shell getprop ro.product.model') do set "MODEL=%%m"
for /f "tokens=*" %%v in ('"%ADB%" shell getprop ro.build.version.release') do set "ANDROID=%%v"
echo Bagli telefon: %MODEL% (Android %ANDROID%)

"%ADB%" logcat -c
echo.
echo ============================================================
echo  Simdi telefonda Anatomi Rehberi'ni acin ve Vucut Haritasi'na
echo  girin. Uyari karti cikarsa "Yine de dene"ye basin.
echo  Uygulama kapaninca bu pencereye donup ENTER'a basin.
echo ============================================================
pause >nul

> "%OUT%" echo Telefon: %MODEL% (Android %ANDROID%)
>> "%OUT%" echo.
>> "%OUT%" echo ===== CRASH =====
"%ADB%" logcat -d -b crash >> "%OUT%" 2>&1
>> "%OUT%" echo.
>> "%OUT%" echo ===== HATA SATIRLARI =====
"%ADB%" logcat -d -v time *:W | findstr /i "anatomi AndroidRuntime FATAL DEBUG libc ReactNativeJS ReactNative EXGL expo-gl OpenGL GLES Adreno Mali hermes SIGSEGV SIGABRT" >> "%OUT%" 2>&1

echo.
echo Kayit masaustune kaydedildi: %OUT%
echo Bu dosyayi gonderin.
start "" notepad "%OUT%"
pause
exit /b 0

:fail
echo Android araclari indirilemedi. Internet baglantisini kontrol edin.
pause
exit /b 1
