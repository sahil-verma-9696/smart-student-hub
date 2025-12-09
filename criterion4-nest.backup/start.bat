@echo off
echo ========================================
echo  Criterion4 NestJS Module - Standalone
echo ========================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server...
echo Server will run on: http://localhost:3001
echo Output directory: %cd%\output
echo.
call npm start
