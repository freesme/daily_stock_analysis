# -*- coding: utf-8 -*-
"""
===================================
A股自选股智能分析系统 - FastAPI Web 服务
===================================

提供：
- GET /health              健康检查
- GET /analysis?code=xxx   触发单只股票的异步分析（分析完成后通过原有通知渠道推送）

鉴权：
- 请求头需要携带 X-API-Token，与配置中的 API_TOKEN 一致

启动方式：
    uvicorn web_app:app --host 0.0.0.0 --port 8000
    uvicorn web_app:app --reload  # 开发模式
"""

import logging
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, Dict
from time import time

from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from config import get_config, Config
from main import trigger_single_stock_flow, setup_logging

# === 初始化配置与日志 ===
config: Config = get_config()
setup_logging(debug=config.debug, log_dir=config.log_dir)

logger = logging.getLogger("web_app")

API_TOKEN: Optional[str] = config.api_token
WEB_PORT: int = config.web_port

# 后台线程池（与原项目理念一致，低并发防封禁）
MAX_WORKERS = max(1, min(config.max_workers or 3, 5))
executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

# 简单防抖：同一股票短时间内重复触发直接提示
_last_submit_ts: Dict[str, float] = {}
MIN_INTERVAL_SECONDS = 10  # 同一 code 至少间隔 10 秒再触发一次


# === FastAPI 应用 ===
app = FastAPI(
    title="Stock Analysis Service",
    description="A股自选股智能分析系统 Web 接口",
    version="1.0.0",
    docs_url="/docs",      # Swagger UI
    redoc_url="/redoc",    # ReDoc
)

# 如需要前端调用，可开放 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议改为具体前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _verify_token(x_api_token: Optional[str]) -> None:
    """
    简单 Token 鉴权：
    - 若配置了 API_TOKEN，则必须带上匹配的 X-API-Token
    - 若未配置 API_TOKEN，则不做校验（适合本地/内网调试）
    """
    if API_TOKEN:
        if not x_api_token:
            raise HTTPException(status_code=401, detail="Missing X-API-Token header")
        if x_api_token != API_TOKEN:
            raise HTTPException(status_code=401, detail="Invalid X-API-Token")


@app.get("/health")
async def health_check():
    """
    健康检查接口
    
    用于容器健康检测、负载均衡探活等
    """
    return {"status": "ok"}


@app.get("/analysis")
async def trigger_analysis(
    code: str = Query(..., description="股票代码，仅支持单个，例如 600519", min_length=1),
    x_api_token: Optional[str] = Header(None, convert_underscores=False),
):
    """
    触发单个股票的异步分析请求
    
    - 仅接受单个 code
    - 不等待分析完成，立即返回 accepted
    - 后台通过 trigger_single_stock_flow 执行完整分析 + 通知
    
    Args:
        code: 股票代码（如 600519、000001）
        x_api_token: 鉴权 Token（Header）
        
    Returns:
        JSON 响应，包含任务提交状态
    """
    # 鉴权
    _verify_token(x_api_token)

    normalized_code = code.strip()
    if not normalized_code:
        raise HTTPException(status_code=400, detail="code 不能为空")

    # 简单校验（A 股代码通常为 6 位数字）
    if len(normalized_code) != 6:
        logger.warning(f"收到非 6 位股票代码: {normalized_code}")

    # 简单防抖：防止同一个 code 被高频重复触发
    now = time()
    last_ts = _last_submit_ts.get(normalized_code)
    if last_ts is not None and now - last_ts < MIN_INTERVAL_SECONDS:
        return JSONResponse(
            {
                "status": "duplicate",
                "code": normalized_code,
                "message": f"该股票刚刚已提交分析请求，请 {MIN_INTERVAL_SECONDS} 秒后再试",
            },
            status_code=200,
        )

    _last_submit_ts[normalized_code] = now

    logger.info(f"收到 Web 分析请求: code={normalized_code}")
    try:
        # 提交后台线程池执行，不阻塞当前请求
        executor.submit(trigger_single_stock_flow, normalized_code)
    except Exception as e:
        logger.exception(f"提交后台任务失败: {e}")
        raise HTTPException(status_code=500, detail="提交分析任务失败")

    return JSONResponse(
        {
            "status": "accepted",
            "code": normalized_code,
            "message": "分析任务已提交，将在完成后通过原有渠道发送通知",
        }
    )


@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化"""
    logger.info("=" * 60)
    logger.info("Stock Analysis Web Service 启动")
    logger.info(f"后台线程池大小: {MAX_WORKERS}")
    logger.info(f"API Token 鉴权: {'已启用' if API_TOKEN else '未启用（仅内网使用）'}")
    logger.info("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时的清理"""
    logger.info("正在关闭后台线程池...")
    executor.shutdown(wait=True)
    logger.info("Stock Analysis Web Service 已关闭")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "web_app:app",
        host="0.0.0.0",
        port=WEB_PORT,
        reload=False,
    )
