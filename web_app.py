"""
Web 服务入口（FastAPI）

提供 HTTP API：
- GET /health      健康检查
- GET /analysis    触发单只股票异步分析

示例：
    uvicorn web_app:app --host 0.0.0.0 --port 8000
"""

import logging
import os
from typing import Optional

from fastapi import FastAPI, BackgroundTasks, HTTPException, Header

from config import get_config
from main import setup_logging, trigger_single_stock_flow


logger = logging.getLogger(__name__)

app = FastAPI(
    title="A股自选股智能分析系统 - Web API",
    description="提供单只股票分析触发接口，分析结果通过原有渠道推送。",
    version="1.0.0",
)


@app.on_event("startup")
def on_startup() -> None:
    """
    应用启动时初始化日志系统等全局配置。
    """
    config = get_config()
    # Web 模式下默认不开 debug 日志，使用配置中的日志目录
    setup_logging(debug=False, log_dir=config.log_dir)
    logger.info("FastAPI Web 服务已启动")


@app.get("/health")
def health() -> dict:
    """
    健康检查接口，用于存活探测。
    """
    return {"status": "ok"}


def _verify_api_token(x_api_token: Optional[str]) -> None:
    """
    校验请求头中的 API Token（如果配置了 API_TOKEN）。

    - 若环境变量 API_TOKEN 未配置，则不启用鉴权；
    - 若已配置且请求未携带或不匹配，则返回 401。
    """
    expected = os.getenv("API_TOKEN")
    if not expected:
        # 未配置则不要求鉴权
        return

    if not x_api_token or x_api_token != expected:
        raise HTTPException(status_code=401, detail="Invalid or missing API token")


@app.get("/analysis")
def trigger_analysis(
    code: str,
    background_tasks: BackgroundTasks,
    x_api_token: Optional[str] = Header(
        default=None,
        alias="X-API-Token",
        description="API 鉴权 Token，与环境变量 API_TOKEN 一致时才允许访问",
    ),
) -> dict:
    """
    触发单只股票异步分析。

    Query 参数:
        - code: 股票代码，如 600519

    Header:
        - X-API-Token: 可选，若配置了 API_TOKEN，则必须匹配

    返回：
        - status: accepted
        - code: 股票代码
        - message: 提交结果说明
    """
    if not code:
        raise HTTPException(status_code=400, detail="参数 code 不能为空")

    # 鉴权（若启用了 API_TOKEN）
    _verify_api_token(x_api_token)

    # 使用后台任务异步执行完整分析流程（包括通知推送）
    background_tasks.add_task(trigger_single_stock_flow, code)

    logger.info(f"收到单股分析请求，已提交后台任务: {code}")

    return {
        "status": "accepted",
        "code": code,
        "message": "分析任务已提交，将在完成后通过原有渠道发送通知",
    }

