# -*- coding: utf-8 -*-
"""
===================================
图片股票代码提取 (Vision LLM)
===================================

从截图/图片中提取股票代码，使用 Vision LLM。
优先级：Gemini -> Anthropic -> OpenAI（首个可用）。
"""

from __future__ import annotations

import base64
import json
import logging
import re
from typing import List, Optional, Tuple

from src.config import get_config

logger = logging.getLogger(__name__)

EXTRACT_PROMPT = """请分析这张股票市场截图或图片，提取其中所有可见的股票代码。

输出格式：仅返回有效的 JSON 数组字符串，不要 markdown、不要解释。
示例：
- A股（6位数字）：600519, 300750, 002594
- 港股（5位数字，可有前导零）：00700, 09988
- 美股（1-5字母）：AAPL, TSLA, MSFT

输出示例：["600519", "300750", "00700"]

若未找到任何股票代码，返回：[]"""

ALLOWED_MIME = frozenset({"image/jpeg", "image/png", "image/webp", "image/gif"})
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5MB
VISION_API_TIMEOUT = 60  # seconds; avoid long blocks on network/API issues

# Magic bytes for server-side MIME validation (client Content-Type can be forged)
_IMAGE_SIGNATURES = {
    "image/jpeg": [b"\xff\xd8\xff"],
    "image/png": [b"\x89PNG\r\n\x1a\n"],
    "image/gif": [b"GIF87a", b"GIF89a"],
    "image/webp": [b"RIFF"],  # bytes[8:12] must be WEBP, checked separately
}


def _verify_image_magic_bytes(image_bytes: bytes, mime_type: str) -> None:
    """Verify actual file content matches declared MIME type (rejects forged Content-Type)."""
    if len(image_bytes) < 12:
        raise ValueError("图片文件过小或损坏")
    if mime_type not in _IMAGE_SIGNATURES:
        raise ValueError(f"无法验证类型: {mime_type}")
    if mime_type == "image/webp":
        if image_bytes[:4] != b"RIFF" or image_bytes[8:12] != b"WEBP":
            raise ValueError("文件内容与声明的类型 image/webp 不匹配，可能被篡改")
        return
    for sig in _IMAGE_SIGNATURES[mime_type]:
        if image_bytes.startswith(sig):
            return
    raise ValueError(f"文件内容与声明的类型 {mime_type} 不匹配，可能被篡改")


def _normalize_code(raw: str) -> Optional[str]:
    """Normalize and validate a single stock code. A-shares & HK: 5-6 digits; US: 1-5 letters."""
    s = raw.strip().upper()
    if not s:
        return None
    # A-shares & HK: 5-6 digit codes (600519, 00700, 09988)
    if s.isdigit() and len(s) in (5, 6):
        return s
    # US stocks: 1-5 letters, optionally with . (e.g. BRK.B)
    if re.match(r"^[A-Z]{1,5}(\.[A-Z])?$", s):
        return s
    # 尝试去除 SH/SZ 后缀
    for suffix in (".SH", ".SZ", ".SS"):
        if s.endswith(suffix):
            base = s[: -len(suffix)].strip()
            if base.isdigit() and len(base) in (5, 6):
                return base
    return None


def _parse_codes_from_text(text: str) -> List[str]:
    """从 LLM 响应文本解析股票代码。"""
    seen: set[str] = set()
    result: List[str] = []

    # 优先尝试 JSON 数组
    cleaned = text.strip()
    for start in ("```json", "```"):
        if start in cleaned:
            idx = cleaned.find(start)
            cleaned = cleaned[idx + len(start) :].strip()
    end_idx = cleaned.rfind("```")
    if end_idx >= 0:
        cleaned = cleaned[:end_idx].strip()

    try:
        data = json.loads(cleaned)
        if isinstance(data, list):
            for item in data:
                if isinstance(item, str):
                    c = _normalize_code(item)
                    if c and c not in seen:
                        seen.add(c)
                        result.append(c)
            return result
    except json.JSONDecodeError:
        pass

    # 兜底：查找 5-6 位数字及美股代码
    for m in re.finditer(r"\b([0-9]{5,6}|[A-Z]{1,5}(\.[A-Z])?)\b", text, re.IGNORECASE):
        c = _normalize_code(m.group(1))
        if c and c not in seen:
            seen.add(c)
            result.append(c)

    return result


def _is_key_valid(key: Optional[str]) -> bool:
    """检查 API Key 是否有效（非占位符）。"""
    return bool(key and not key.startswith("your_") and len(key) >= 8)


def _select_vision_provider() -> str:
    """返回首个可用的 Vision 提供方：gemini、anthropic、openai。"""
    cfg = get_config()
    if _is_key_valid(cfg.gemini_api_key):
        return "gemini"
    if _is_key_valid(cfg.anthropic_api_key):
        return "anthropic"
    if _is_key_valid(cfg.openai_api_key):
        return "openai"
    return ""


def _call_gemini(image_b64: str, mime_type: str) -> str:
    """调用 Gemini Vision API。"""
    import google.generativeai as genai

    cfg = get_config()
    genai.configure(api_key=cfg.gemini_api_key)
    # 使用支持图像的模型（gemini-1.5-flash / gemini-2.0-flash）
    # Ensure non-empty model name (cfg.gemini_model can be "")
    model_name = (getattr(cfg, "gemini_model", "gemini-2.0-flash") or "gemini-2.0-flash")
    if "gemini-3" in (model_name or ""):
        model_name = "gemini-2.0-flash"
    model = genai.GenerativeModel(model_name)
    # Gemini API 要求的 inline_data 格式
    part = {"inline_data": {"mime_type": mime_type, "data": image_b64}}
    response = model.generate_content(
        [part, EXTRACT_PROMPT],
        request_options={"timeout": VISION_API_TIMEOUT},
    )
    if response and response.text:
        return response.text
    raise ValueError("Gemini returned empty response")


def _call_anthropic(image_b64: str, mime_type: str) -> str:
    """调用 Anthropic Messages API（带图像）。"""
    from anthropic import Anthropic

    cfg = get_config()
    client = Anthropic(api_key=cfg.anthropic_api_key, timeout=VISION_API_TIMEOUT)
    msg = client.messages.create(
        model=cfg.anthropic_model,
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": mime_type,
                            "data": image_b64,
                        },
                    },
                    {"type": "text", "text": EXTRACT_PROMPT},
                ],
            }
        ],
    )
    if msg.content and len(msg.content) > 0 and hasattr(msg.content[0], "text"):
        return msg.content[0].text
    raise ValueError("Anthropic returned empty response")


def _call_openai(image_b64: str, mime_type: str) -> str:
    """调用 OpenAI Chat Completions（图像采用 base64 data URL）。"""
    from openai import OpenAI

    cfg = get_config()
    client_kwargs = {"api_key": cfg.openai_api_key, "timeout": VISION_API_TIMEOUT}
    if cfg.openai_base_url and cfg.openai_base_url.startswith("http"):
        client_kwargs["base_url"] = cfg.openai_base_url
    if cfg.openai_base_url and "aihubmix.com" in cfg.openai_base_url:
        client_kwargs["default_headers"] = {"APP-Code": "GPIJ3886"}
    client = OpenAI(**client_kwargs)
    # 使用 Vision 专用模型（若配置），否则用 openai_model（部分第三方模型不支持图像）
    model = (cfg.openai_vision_model or cfg.openai_model or "gpt-4o-mini").strip() or "gpt-4o-mini"
    data_url = f"data:{mime_type};base64,{image_b64}"
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": EXTRACT_PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {"url": data_url},
                    },
                ],
            }
        ],
        max_tokens=1024,
    )
    if response and response.choices and response.choices[0].message.content:
        return response.choices[0].message.content
    raise ValueError("OpenAI returned empty response")


def extract_stock_codes_from_image(
    image_bytes: bytes,
    mime_type: str,
) -> Tuple[List[str], str]:
    """
    从图片中提取股票代码（使用 Vision LLM）。

    优先级：Gemini -> Anthropic -> OpenAI（首个可用）。

    Args:
        image_bytes: 原始图片字节
        mime_type: MIME 类型（如 image/jpeg, image/png）

    Returns:
        (codes, raw_text) - 去重后的股票代码列表及原始 LLM 响应。

    Raises:
        ValueError: 图片无效、未配置 Vision API 或提取失败时。
    """
    mime_type = (mime_type or "image/jpeg").strip().lower().split(";")[0].strip()
    if mime_type not in ALLOWED_MIME:
        raise ValueError(f"不支持的图片类型: {mime_type}。允许: {list(ALLOWED_MIME)}")

    if not image_bytes:
        raise ValueError("图片内容为空")

    if len(image_bytes) > MAX_SIZE_BYTES:
        raise ValueError(f"Image too large (max {MAX_SIZE_BYTES // (1024 * 1024)}MB)")

    _verify_image_magic_bytes(image_bytes, mime_type)

    provider = _select_vision_provider()
    if not provider:
        raise ValueError(
            "未配置 Vision API。请设置 GEMINI_API_KEY、ANTHROPIC_API_KEY 或 OPENAI_API_KEY。"
        )

    image_b64 = base64.b64encode(image_bytes).decode("ascii")

    order = [provider] if provider else []
    for p in ["gemini", "anthropic", "openai"]:
        if p not in order:
            order.append(p)

    last_err: Optional[Exception] = None
    for p in order:
        cfg = get_config()
        if p == "gemini" and not _is_key_valid(cfg.gemini_api_key):
            continue
        if p == "anthropic" and not _is_key_valid(cfg.anthropic_api_key):
            continue
        if p == "openai" and not _is_key_valid(cfg.openai_api_key):
            continue

        try:
            if p == "gemini":
                raw = _call_gemini(image_b64, mime_type)
            elif p == "anthropic":
                raw = _call_anthropic(image_b64, mime_type)
            elif p == "openai":
                raw = _call_openai(image_b64, mime_type)
            else:
                continue
            codes = _parse_codes_from_text(raw)
            logger.info(
                f"[ImageExtractor] {p} 提取 {len(codes)} 个代码: "
                f"{codes[:10]}{'...' if len(codes) > 10 else ''}"
            )
            return codes, raw
        except Exception as e:
            last_err = e
            logger.warning(f"[ImageExtractor] {p} 调用失败: {e}")
            continue

    raise ValueError(
        "所有 Vision API 均调用失败，请检查 API Key 与网络。"
    ) from last_err
