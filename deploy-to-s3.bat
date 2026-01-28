@echo off
echo ========================================
echo   PDF Pal - Deploy to AWS S3
echo ========================================
echo.

REM Check if AWS CLI is installed
where aws >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo AWS CLI is not installed!
    echo Please install from: https://aws.amazon.com/cli/
    echo.
    pause
    exit /b 1
)

REM Build the app
echo [1/3] Building the application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo ✓ Build successful!
echo.

REM Get bucket name
set /p BUCKET_NAME="Enter your S3 bucket name: "
if "%BUCKET_NAME%"=="" (
    echo Bucket name cannot be empty!
    pause
    exit /b 1
)

REM Upload to S3
echo [2/3] Uploading to S3 bucket: %BUCKET_NAME%...
aws s3 sync dist/ s3://%BUCKET_NAME%/ --delete
if %ERRORLEVEL% NEQ 0 (
    echo Upload failed!
    echo Make sure:
    echo - AWS CLI is configured (run: aws configure)
    echo - Bucket exists and you have permissions
    pause
    exit /b 1
)
echo ✓ Upload successful!
echo.

REM Optional: Invalidate CloudFront
set /p CLOUDFRONT_ID="Enter CloudFront Distribution ID (or press Enter to skip): "
if not "%CLOUDFRONT_ID%"=="" (
    echo [3/3] Invalidating CloudFront cache...
    aws cloudfront create-invalidation --distribution-id %CLOUDFRONT_ID% --paths "/*"
    echo ✓ CloudFront invalidated!
) else (
    echo [3/3] Skipping CloudFront invalidation
)

echo.
echo ========================================
echo   Deployment Complete! 🎉
echo ========================================
echo.
echo Your app is now live at:
echo http://%BUCKET_NAME%.s3-website-us-east-1.amazonaws.com
echo.
echo (Or your CloudFront URL if configured)
echo.
pause

