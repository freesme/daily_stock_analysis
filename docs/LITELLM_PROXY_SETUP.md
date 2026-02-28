# LiteLLM Proxy 接入指南

通过 LiteLLM Proxy 可在单一 OpenAI 兼容接口后统一路由 Gemini、DeepSeek、Claude 等模型，并自动处理 Reasoning 模型（Gemini 3 等）的 `thought_signature` 透传，避免多轮工具调用 400 错误。

## 适用场景

- 同时使用多个模型，通过一个 Base URL 切换
- 通过代理访问 Gemini 3 等 Reasoning 模型，避免 400 错误
- 本地开发时统一管理各厂商 API Key

## 安装

```bash
pip install 'litellm[proxy]'
```

或使用 Docker：

```bash
docker run -p 4000:4000 ghcr.io/berriai/litellm:main-latest --config /path/to/litellm_config.yaml
```

## 配置与启动

1. 复制示例配置到项目根目录：

   ```bash
   cp litellm_config.yaml.example litellm_config.yaml
   ```

2. 编辑 `litellm_config.yaml`，填入各厂商 API Key 对应的环境变量名（如 `os.environ/GEMINI_API_KEY`），并确保这些环境变量在启动 LiteLLM 时已设置。

3. 启动 LiteLLM Proxy：

   ```bash
   litellm --config litellm_config.yaml
   ```

   默认监听 `http://localhost:4000`。

## 项目侧 .env 配置

在项目 `.env` 中配置以下变量，使本系统通过 LiteLLM Proxy 访问模型：

```bash
# 【方案五】使用 LiteLLM Proxy
OPENAI_BASE_URL=http://localhost:4000/v1
OPENAI_API_KEY=sk-litellm-proxy-local   # 22 字符，满足项目校验 (>=8)；无认证时可用此值
OPENAI_MODEL=gemini/gemini-3-pro-preview
```

### 关键警告

**必须清空或注释以下变量**，否则系统优先走原生 SDK，绕过 LiteLLM Proxy：

- `AIHUBMIX_KEY` — 若配置，`openai_base_url` 会默认指向 aihubmix，覆盖 LiteLLM
- `GEMINI_API_KEY` — 若配置，`LLMToolAdapter` 优先使用 Gemini 原生 SDK
- `ANTHROPIC_API_KEY` — 若配置，会优先使用 Anthropic 原生 SDK

系统 Provider 优先级为：**Gemini > Anthropic > OpenAI 兼容**。使用 LiteLLM Proxy 时，仅保留 `OPENAI_BASE_URL` + `OPENAI_API_KEY` + `OPENAI_MODEL`，确保请求走 `_call_openai` 路径。

## 模型名格式

LiteLLM 使用 `{provider}/{model}` 格式，例如：

| 模型           | OPENAI_MODEL 值              |
|----------------|-----------------------------|
| Gemini 3 Pro   | `gemini/gemini-3-pro-preview` |
| Gemini 3 Flash | `gemini/gemini-3-flash-preview` |
| DeepSeek Chat  | `deepseek/deepseek-chat`     |
| DeepSeek R1    | `deepseek/deepseek-r1`       |
| OpenAI GPT-4o  | `openai/gpt-4o`             |

`litellm_config.yaml` 中的 `model_name` 需与 `.env` 中 `OPENAI_MODEL` 一致。

## OPENAI_API_KEY 说明

- 项目要求 API Key 长度 `>= 8`（满足 LiteLLM 本地开发常用短 Key）
- 无认证模式：可使用 `sk-litellm-proxy-local`（22 字符）
- 有认证模式：在 LiteLLM 配置中设置 `master_key`，项目 `.env` 中 `OPENAI_API_KEY` 填该值

## 常见问题

### 端口冲突

默认 4000 端口被占用时，可指定：

```bash
litellm --config litellm_config.yaml --port 4001
```

项目 `.env` 中 `OPENAI_BASE_URL` 需对应修改为 `http://localhost:4001/v1`。

### 400 错误（多轮工具调用）

若仍出现 400，请确认：

1. 项目已应用 Agent Reasoning 400 修复（`thought_signature` 透传）
2. `litellm_config.yaml` 中已设置 `litellm_settings.drop_params: true`
3. 未同时配置 `GEMINI_API_KEY` 等原生 Key，否则请求不会经过 LiteLLM

### 网络与 Docker

LiteLLM 与项目同机时使用 `localhost`；若 LiteLLM 在 Docker 中、项目在宿主机，使用 `http://localhost:4000/v1`；若项目也在 Docker，使用 `http://host.docker.internal:4000/v1` 或 Docker 网络内服务名。
