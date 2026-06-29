@echo off
echo Starting Project Prashnottari...

:: Start the backend in a new command window
echo Launching Java Backend...
start "Quiz Backend" cmd /k "cd QuizApp && start-backend.bat"

:: Start the frontend in a new command window
echo Launching React Frontend...
start "Quiz Frontend" cmd /k "cd quizz-frontend\src && start-react.bat"

echo All services launched! You can close this window.
