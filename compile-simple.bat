@echo off
chcp 65001 > nul
echo 🔄 Compilando Boxes Legends (versão simples)...
echo 🔍 Verificando versão do Java:

java -version
javac -version

echo ✅ Compilando classes essenciais...

REM ⚠️ Compile APENAS classes do core (sem UI)
javac -d bin -cp "lib/jars_mssql/mssql-jdbc-12.10.1.jre11.jar" ^
    src/main/java/com/BoxesLegends/Main.java ^
    src/main/java/com/BoxesLegends/database/*.java ^
    src/main/java/com/BoxesLegends/models/*.java ^
    src/main/java/com/BoxesLegends/services/*.java ^
    src/main/java/com/BoxesLegends/utils/*.java

if %errorlevel% neq 0 (
    echo ❌ Erro na compilação!
    pause
    exit /b 1
)

echo ✅ Compilação concluída!
echo 🚀 Para executar: run-simple.bat
pause