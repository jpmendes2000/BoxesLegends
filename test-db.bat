@echo off
chcp 65001 > nul
echo 🧪 Testando conexão com banco de dados...
echo 🔍 Testando conectividade...

REM ⚠️ USE CAMINHO ABSOLUTO do Java 21
"C:\Program Files\RedHat\java-21-openjdk-21.0.7.0.6-1\bin\java.exe" -cp "bin;lib/jars_mssql/mssql-jdbc-12.10.1.jre11.jar" com.BoxesLegends.database.DatabaseConnection

if %errorlevel% neq 0 (
    echo ❌ Se deu erro:
    echo    - Verifique se SQL Server está rodando
    echo    - Teste: sqlcmd -S localhost -U sa
    echo    - Verifique senha em DatabaseConnection.java
    pause
    exit /b 1
)

echo ✅ Conexão bem-sucedida!
pause