@echo off
echo 🚀 Executando Boxes Legends...

REM Verificar se foi compilado
if not exist "target\classes\com\BoxesLegends\Main.class" (
    echo ❌ Projeto não compilado! Execute compile.bat primeiro.
    pause
    exit /b 1
)

REM Executar a aplicação principal
echo 🎮 Iniciando aplicação...
java -cp "target\classes;lib\jars_mssql\mssql-jdbc-12.10.1.jre11.jar" ^
     --module-path lib\javafx ^
     --add-modules javafx.controls,javafx.fxml ^
     --add-opens javafx.fxml/javafx.fxml=ALL-UNNAMED ^
     com.BoxesLegends.Main

if errorlevel 1 (
    echo ❌ Erro na execução!
    echo 💡 Verifique se:
    echo    - SQL Server está rodando
    echo    - JavaFX está na pasta lib\javafx
    echo    - Credenciais do banco estão corretas
    pause
)

echo 👋 Aplicação finalizada.
pause