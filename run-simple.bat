@echo off
chcp 65001 > nul
echo 🚀 Executando Boxes Legends...
echo 📱 Iniciando aplicação...

REM ⚠️ USE CAMINHO ABSOLUTO do Java 21
"C:\Program Files\RedHat\java-21-openjdk-21.0.7.0.6-1\bin\java.exe" -cp "bin;lib/jars_mssql/mssql-jdbc-12.10.1.jre11.jar" com.BoxesLegends.Main

if %errorlevel% neq 0 (
    echo ❌ Erro na execução!
    echo 💡 Verifique se:
    echo    - SQL Server está rodando
    echo    - Credenciais do banco estão corretas
    pause
    exit /b 1
)

echo ✅ Aplicação finalizada com sucesso!
pause