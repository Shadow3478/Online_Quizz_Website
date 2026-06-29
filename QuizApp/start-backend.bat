@echo off
echo -----------------------------------
echo Compiling Java Backend...
echo -----------------------------------
cd src
javac -cp "..\json-20240303.jar;..\mysql-connector-j-9.5.0.jar" quizbackend\*.java
if %errorlevel% neq 0 (
    echo.
    echo ❌ Compilation failed! Check the errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo -----------------------------------
echo Starting Quiz Server...
echo -----------------------------------
java -cp "..\json-20240303.jar;..\mysql-connector-j-9.5.0.jar;." quizbackend.QuizzServer
pause
