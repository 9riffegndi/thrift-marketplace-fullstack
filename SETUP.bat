@echo off
echo [Recloth] Initializing Monorepo Setup...

echo.
echo [1/2] Backend Setup...
cd recloth-be
call composer install
if not exist .env copy .env.example .env
call php artisan key:generate
cd ..

echo.
echo [2/2] Frontend Setup...
cd recloth-fe
call npm install
cd ..

echo.
echo [Done] Setup complete!
pause
