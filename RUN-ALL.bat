@echo off
echo [Recloth] Starting all services...

:: Start Backend
start cmd /k "echo Starting Backend... && cd recloth-be && php artisan serve"

:: Start Reverb (Websockets)
start cmd /k "echo Starting Reverb... && cd recloth-be && php artisan reverb:start"

:: Start Frontend
start cmd /k "echo Starting Frontend... && cd recloth-fe && npm run dev"

echo [Running] Check the new windows for status.
