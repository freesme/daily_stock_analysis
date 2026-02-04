# -*- coding: utf-8 -*-
"""
===================================
Daily Stock Analysis - 一键启动入口
===================================

用于 PyInstaller 打包的入口文件。
启动后会自动打开浏览器访问 Web 界面。
"""

import os
import sys
import time
import webbrowser
import threading
import logging
from pathlib import Path

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def get_base_path() -> Path:
    """获取应用根目录（兼容打包后和开发环境）"""
    if getattr(sys, 'frozen', False):
        # PyInstaller 打包后的路径
        return Path(sys.executable).parent
    else:
        # 开发环境
        return Path(__file__).parent


def setup_environment():
    """设置运行环境"""
    base_path = get_base_path()
    
    # 设置工作目录
    os.chdir(base_path)
    
    # 确保数据目录存在
    data_dir = base_path / "data"
    data_dir.mkdir(exist_ok=True)
    
    # 设置默认环境变量（如果未设置）
    if not os.environ.get("DATABASE_PATH"):
        os.environ["DATABASE_PATH"] = str(data_dir / "stock_analysis.db")
    
    logger.info(f"应用根目录: {base_path}")
    logger.info(f"数据库路径: {os.environ.get('DATABASE_PATH')}")


def open_browser(port: int, delay: float = 2.0):
    """延迟打开浏览器"""
    def _open():
        time.sleep(delay)
        url = f"http://127.0.0.1:{port}"
        logger.info(f"正在打开浏览器: {url}")
        webbrowser.open(url)
    
    thread = threading.Thread(target=_open, daemon=True)
    thread.start()


def check_static_files() -> bool:
    """检查前端静态文件是否存在"""
    base_path = get_base_path()
    static_dir = base_path / "static"
    index_file = static_dir / "index.html"
    
    if not static_dir.exists():
        logger.warning(f"静态文件目录不存在: {static_dir}")
        return False
    
    if not index_file.exists():
        logger.warning(f"index.html 不存在: {index_file}")
        return False
    
    logger.info(f"静态文件目录: {static_dir}")
    return True


def main():
    """主入口函数"""
    print("=" * 60)
    print("       Daily Stock Analysis - 股票智能分析系统")
    print("=" * 60)
    print()
    
    # 设置环境
    setup_environment()
    
    # 检查静态文件
    has_frontend = check_static_files()
    if has_frontend:
        print("[OK] 前端静态文件已就绪")
    else:
        print("[!] 警告: 未找到前端静态文件，仅启动 API 服务")
        print("    请运行 'cd apps/dsa-web && npm run build' 构建前端")
    
    # 检查配置
    if not os.environ.get("GEMINI_API_KEY") and not os.environ.get("OPENAI_API_KEY"):
        print()
        print("[!] 警告: 未设置 AI API 密钥")
        print("    请在 .env 文件中配置 GEMINI_API_KEY 或 OPENAI_API_KEY")
    
    print()
    print("-" * 60)
    
    # 启动参数
    host = "127.0.0.1"
    port = 8000
    
    print(f"正在启动服务...")
    print(f"  - API 地址: http://{host}:{port}")
    print(f"  - API 文档: http://{host}:{port}/docs")
    if has_frontend:
        print(f"  - Web 界面: http://{host}:{port}")
    print()
    print("按 Ctrl+C 停止服务")
    print("-" * 60)
    print()
    
    # 自动打开浏览器
    if has_frontend:
        open_browser(port, delay=2.0)
    
    # 启动 uvicorn 服务
    try:
        import uvicorn
        uvicorn.run(
            "server:app",
            host=host,
            port=port,
            log_level="info",
            reload=False,  # 打包后不支持 reload
        )
    except KeyboardInterrupt:
        print("\n服务已停止")
    except Exception as e:
        logger.error(f"启动失败: {e}")
        input("按 Enter 键退出...")
        sys.exit(1)


if __name__ == "__main__":
    main()
