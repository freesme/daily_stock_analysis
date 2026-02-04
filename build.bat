@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ============================================================
echo        Daily Stock Analysis - 打包脚本
echo ============================================================
echo.

:: 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请先安装 Python 3.10+
    pause
    exit /b 1
)

:: 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)

:: 检查 PyInstaller
pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo [信息] 正在安装 PyInstaller...
    pip install pyinstaller
)

echo.
echo [1/4] 安装 Python 依赖...
echo ------------------------------------------------------------
pip install -r requirements.txt
if errorlevel 1 (
    echo [错误] Python 依赖安装失败
    pause
    exit /b 1
)

echo.
echo [2/4] 构建前端...
echo ------------------------------------------------------------
cd apps\dsa-web

:: 检查 node_modules
if not exist "node_modules" (
    echo [信息] 安装前端依赖...
    call npm install
)

:: 构建前端
call npm run build
if errorlevel 1 (
    echo [错误] 前端构建失败
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

:: 验证静态文件
if not exist "static\index.html" (
    echo [错误] 前端构建产物不存在
    pause
    exit /b 1
)
echo [成功] 前端构建完成

echo.
echo [3/4] 打包为可执行文件...
echo ------------------------------------------------------------
pyinstaller daily_stock_analysis.spec --noconfirm
if errorlevel 1 (
    echo [错误] PyInstaller 打包失败
    pause
    exit /b 1
)

echo.
echo [4/4] 创建发布目录...
echo ------------------------------------------------------------

:: 创建 data 目录
if not exist "dist\DailyStockAnalysis\data" (
    mkdir "dist\DailyStockAnalysis\data"
)

:: 复制 .env.example
if exist ".env.example" (
    copy ".env.example" "dist\DailyStockAnalysis\.env.example" >nul
)

:: 创建启动说明
(
echo Daily Stock Analysis - 股票智能分析系统
echo ========================================
echo.
echo 使用方法:
echo   1. 复制 .env.example 为 .env
echo   2. 在 .env 中配置 GEMINI_API_KEY 或 OPENAI_API_KEY
echo   3. 双击 DailyStockAnalysis.exe 启动
echo.
echo 访问地址:
echo   - Web 界面: http://127.0.0.1:8000
echo   - API 文档: http://127.0.0.1:8000/docs
echo.
echo 注意事项:
echo   - 首次启动会自动创建数据库
echo   - 按 Ctrl+C 停止服务
echo   - 数据文件保存在 data 目录
) > "dist\DailyStockAnalysis\README.txt"

echo.
echo ============================================================
echo                      打包完成!
echo ============================================================
echo.
echo 输出目录: dist\DailyStockAnalysis\
echo.
echo 文件列表:
dir /b "dist\DailyStockAnalysis\"
echo.
echo 可以将 dist\DailyStockAnalysis 文件夹复制到其他电脑使用
echo.
pause
