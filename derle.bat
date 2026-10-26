@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion
title Anatomi Rehberi - Derleme

rem ============================================================
rem  Anatomi Rehberi - otomatik derleme (EAS)
rem  Cift tiklayarak calistirin. Proje klasorunde degilse
rem  projeyi GitHub'dan %USERPROFILE%\anatomi klasorune indirir.
rem ============================================================

set "REPO_URL=https://github.com/karmabyte372/anatomi.git"
set "REPO_BRANCH=claude/anatomi-app"
set "EAS=call npx --yes eas-cli@latest"

rem --- Proje klasorunu bul ---
cd /d "%~dp0"
if not exist "package.json" (
  if exist "%USERPROFILE%\anatomi\package.json" (
    cd /d "%USERPROFILE%\anatomi"
  ) else (
    echo Proje bulunamadı, GitHub'dan indiriliyor...
    where git >nul 2>nul || (
      echo [HATA] Git yüklü değil. https://git-scm.com/download/win adresinden kurup tekrar deneyin.
      start "" "https://git-scm.com/download/win"
      goto :fail
    )
    git clone -b %REPO_BRANCH% %REPO_URL% "%USERPROFILE%\anatomi" || goto :fail
    cd /d "%USERPROFILE%\anatomi"
  )
)
echo Proje klasörü: %CD%

rem --- Node.js kontrolü ---
where node >nul 2>nul || (
  echo [HATA] Node.js yüklü değil. LTS sürümünü kurup bu dosyayı tekrar çalıştırın.
  start "" "https://nodejs.org/tr/download"
  goto :fail
)
for /f "delims=" %%v in ('node -v') do echo Node.js %%v bulundu.

rem --- Bağımlılıklar ---
if not exist "node_modules" (
  echo.
  echo Bağımlılıklar yükleniyor, bu birkaç dakika sürebilir...
  call npm install || goto :fail
)

rem --- Expo girişi ---
echo.
echo Expo hesabı kontrol ediliyor...
%EAS% whoami >nul 2>nul
if errorlevel 1 (
  echo Expo hesabınıza giriş yapın ^(hesabınız yoksa https://expo.dev/signup^):
  %EAS% login || goto :fail
)

rem --- Projeyi EAS'e bağla (ilk sefer) ---
findstr /c:"projectId" app.json >nul 2>nul
if errorlevel 1 (
  echo.
  echo Proje Expo hesabınıza bağlanıyor...
  %EAS% init || goto :fail
)

:menu
echo.
echo ============================================================
echo   ANATOMİ REHBERİ - DERLEME MENÜSÜ
echo ============================================================
echo   1. Android test sürümü (telefona kurulan APK)
echo   2. Android Google Play sürümü (AAB) + gönder
echo   3. iPhone kaydet (UDID - test sürümü için bir kez)
echo   4. iPhone test sürümü (kayıtlı iPhone'lara kurulur)
echo   5. iPhone TestFlight sürümü + App Store Connect'e gönder
echo   6. Her iki mağaza sürümü (Android + iOS) + gönder
echo   7. Kod kontrolleri (tip, lint, expo-doctor)
echo   0. Çıkış
echo ============================================================
set "secim="
set /p "secim=Seçiminiz: "

if "%secim%"=="1" goto :android_test
if "%secim%"=="2" goto :android_store
if "%secim%"=="3" goto :ios_device
if "%secim%"=="4" goto :ios_test
if "%secim%"=="5" goto :ios_store
if "%secim%"=="6" goto :all_store
if "%secim%"=="7" goto :checks
if "%secim%"=="0" goto :end
echo Geçersiz seçim.
goto :menu

:android_test
%EAS% build --profile preview --platform android
goto :done

:android_store
call :run_checks || goto :done
%EAS% build --profile production --platform android --auto-submit
goto :done

:ios_device
echo iPhone'da Safari ile açılacak bir link/QR kod oluşturulacak. "Website" seçeneğini seçin.
%EAS% device:create
goto :done

:ios_test
%EAS% build --profile preview --platform ios
goto :done

:ios_store
call :run_checks || goto :done
%EAS% build --profile production --platform ios --auto-submit
goto :done

:all_store
call :run_checks || goto :done
%EAS% build --profile production --platform all --auto-submit
goto :done

:checks
call :run_checks
goto :done

rem --- Mağaza derlemesinden önce kod kontrolleri ---
:run_checks
echo.
echo Kod kontrolleri çalışıyor...
call npx tsc --noEmit || (echo [HATA] Tip kontrolü başarısız. & exit /b 1)
call npx expo lint || (echo [HATA] Lint başarısız. & exit /b 1)
call npx --yes expo-doctor || (echo [UYARI] expo-doctor sorun buldu, yukarıdaki çıktıyı kontrol edin. & exit /b 1)
echo Kontroller temiz.
exit /b 0

:done
echo.
echo İşlem tamamlandı. Derleme durumunu https://expo.dev adresinden de takip edebilirsiniz.
goto :menu

:fail
echo.
echo İşlem yarıda kaldı. Yukarıdaki hata mesajını kontrol edin.
pause
exit /b 1

:end
endlocal
exit /b 0
