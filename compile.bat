@echo off
echo 🔨 Compilando Boxes Legends...

REM Criar diretório target se não existir
if not exist "target\classes" mkdir target\classes

REM Compilar todas as classes Java
echo ⚙️ Compilando classes Java...
javac -cp "lib\jars_mssql\mssql-jdbc-12.10.1.jre11.jar" -d target\classes ^
    src\main\java\com\BoxesLegends\*.java ^
    src\main\java\com\BoxesLegends\database\*.java ^
    src\main\java\com\BoxesLegends\models\*.java ^
    src\main\java\com\BoxesLegends\services\*.java ^
    src\main\java\com\BoxesLegends\ui\controllers\*.java ^
    src\main\java\com\BoxesLegends\ui\activities\*.java ^
    src\main\java\com\BoxesLegends\ui\components\*.java ^
    src\main\java\com\BoxesLegends\utils\*.java ^
    src\main\java\com\BoxesLegends\exceptions\*.java

if errorlevel 1 (
    echo ❌ Erro na compilação!
    pause
    exit /b 1
)

REM Copiar recursos (FXML, SQL, CSS, etc.)
echo 📋 Copiando recursos...

if not exist "target\classes\fxml" mkdir target\classes\fxml
if not exist "target\classes\db" mkdir target\classes\db
if not exist "target\classes\css" mkdir target\classes\css
if not exist "target\classes\img" mkdir target\classes\img

copy src\main\resources\fxml\*.fxml target\classes\fxml\ >nul 2>&1
copy src\main\resources\db\*.sql target\classes\db\ >nul 2>&1
copy src\main\resources\css\*.css target\classes\css\ >nul 2>&1
copy src\main\resources\img\*.* target\classes\img\ >nul 2>&1

echo ✅ Compilação concluída!
echo 🚀 Para executar: run.bat
pause
