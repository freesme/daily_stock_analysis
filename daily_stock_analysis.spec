# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller 打包配置文件

使用方法:
    pyinstaller daily_stock_analysis.spec

输出:
    dist/DailyStockAnalysis/
        ├── DailyStockAnalysis.exe
        ├── static/          (前端静态文件)
        ├── data/            (数据目录)
        └── .env.example     (环境变量模板)
"""

import os
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(SPECPATH)

# 收集所有需要的数据文件
datas = [
    # 前端静态文件
    (str(PROJECT_ROOT / 'static'), 'static'),
    # 环境变量模板
    (str(PROJECT_ROOT / '.env.example'), '.'),
]

# 如果 static 目录不存在，给出警告
if not (PROJECT_ROOT / 'static' / 'index.html').exists():
    print("=" * 60)
    print("警告: static 目录不存在或为空！")
    print("请先运行: cd apps/dsa-web && npm run build")
    print("=" * 60)
    # 移除 static 数据项
    datas = [(src, dst) for src, dst in datas if 'static' not in src]

# 收集隐式导入的模块
hiddenimports = [
    # FastAPI 相关
    'uvicorn',
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
    'fastapi',
    'starlette',
    'pydantic',
    
    # 数据库
    'sqlalchemy',
    'sqlalchemy.sql.default_comparator',
    'sqlalchemy.ext.declarative',
    
    # 数据处理
    'pandas',
    'numpy',
    
    # 数据源
    'efinance',
    'akshare',
    'yfinance',
    'baostock',
    
    # HTTP 客户端
    'httpx',
    'requests',
    'aiohttp',
    
    # AI 模型
    'google.generativeai',
    'openai',
    
    # 其他
    'tenacity',
    'dotenv',
    'python-dotenv',
    
    # 项目模块
    'server',
    'api',
    'api.v1',
    'api.v1.router',
    'api.v1.endpoints',
    'api.v1.endpoints.analysis',
    'api.v1.endpoints.history',
    'api.v1.endpoints.stocks',
    'api.deps',
    'src',
    'src.config',
    'src.storage',
    'src.analyzer',
    'src.notification',
    'src.search_service',
    'src.formatters',
    'src.enums',
    'src.services',
    'src.services.history_service',
    'data_provider',
    'data_provider.base',
    'data_provider.efinance_fetcher',
    'data_provider.akshare_fetcher',
    'data_provider.yfinance_fetcher',
    'web',
    'web.services',
]

# 排除不需要的模块（减小体积）
excludes = [
    'tkinter',
    'matplotlib',
    'PIL',
    'scipy',
    'pytest',
    'IPython',
    'jupyter',
]

a = Analysis(
    ['app_launcher.py'],
    pathex=[str(PROJECT_ROOT)],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=excludes,
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='DailyStockAnalysis',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,  # 显示控制台窗口
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,  # 可以添加图标: icon='icon.ico'
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='DailyStockAnalysis',
)
