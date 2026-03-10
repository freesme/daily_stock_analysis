# LLM 配置指南

本文档系统讲解 A股智能分析系统的 LLM 配置方式，包括三层配置优先级、快速上手、渠道模式、Vision 模型、Agent 模式及配置校验排错。

> 快速上手请参考 [README](../README.md)，本文档为进阶配置。

## 目录

- [1. 快速上手（5 分钟）](#1-快速上手5-分钟)
- [2. 三层配置优先级](#2-三层配置优先级)
- [3. 进阶配置](#3-进阶配置)
- [4. 扩展功能](#4-扩展功能)
- [5. 迁移与兼容](#5-迁移与兼容)

---

## 1. 快速上手（5 分钟）

### 1.1 最小配置

任选其一即可运行 AI 分析：

| 选项 | 环境变量 | 说明 |
|------|----------|------|
| Gemini | `GEMINI_API_KEY=xxx` | [Google AI Studio](https://aistudio.google.com/) 免费额度，需科学上网 |
| DeepSeek | `DEEPSEEK_API_KEY=xxx` | [DeepSeek 平台](https://platform.deepseek.com) |
| AIHubmix | `AIHUBMIX_KEY=xxx` | [AIHubmix](https://aihubmix.com/?aff=CfMq) 聚合，一 Key 多模型，无需科学上网 |

多 Key 负载均衡：`GEMINI_API_KEYS=key1,key2,key3`、`DEEPSEEK_API_KEYS=key1,key2` 等。

### 1.2 验证

- **配置校验**：`python test_env.py --config` — 仅检查配置结构，不调用 API
- **完整 LLM 测试**：`python test_env.py --llm` — 实际调用 API（需网络、消耗额度）

### 1.3 场景选择

- **单模型** → 场景 A：填对应 API Key 即可
- **多模型 / 多平台 / 需隔离 base_url** → 场景 B：使用渠道模式或 YAML 模式

### 1.4 其他入口

- **CLI 交互式引导**：`python -m dsa init` — 单模型快速配置，9 个 provider 预设
- **Web 设置页**：系统设置 → AI 模型 → 渠道编辑器 — 可视化配置多渠道

---

## 2. 三层配置优先级

### 2.1 优先级

```
LITELLM_CONFIG (YAML)  >  LLM_CHANNELS (env)  >  legacy keys
```

高优先级一旦生效，低优先级**全部忽略**。

### 2.2 模式对比

| 模式 | 适用场景 | 配置方式 |
|------|----------|----------|
| YAML | 复杂路由、多 deployment、标准 LiteLLM 格式 | `LITELLM_CONFIG=./litellm_config.yaml` |
| 渠道 | 多模型共存、每渠道独立 base_url/api_key | `LLM_CHANNELS=aihubmix,deepseek,gemini` + `LLM_{NAME}_*` |
| Legacy | 单模型、最简单 | `GEMINI_API_KEY` / `DEEPSEEK_API_KEY` / `AIHUBMIX_KEY` 等 |

### 2.3 「不要混用」说明

一旦配置了渠道或 YAML，legacy 区域（`GEMINI_API_KEY`、`OPENAI_API_KEY` 等）**不参与**解析。反之，仅配置 legacy 时，渠道和 YAML 不生效。系统按优先级只取一种。

### 2.4 provider 前缀

`LITELLM_MODEL` 必须为 `provider/model` 格式，例如：

- `gemini/gemini-2.5-flash`
- `openai/gpt-4o-mini`
- `anthropic/claude-3-5-sonnet-20241022`
- `deepseek/deepseek-chat`

旧格式 `GEMINI_MODEL`（无前缀）仅用于未配置 `LITELLM_MODEL` 时的自动推断。

---

## 3. 进阶配置

### 3.1 渠道模式（LLM_CHANNELS）

环境变量格式：

```
LLM_CHANNELS=aihubmix,deepseek,gemini

LLM_{NAME}_BASE_URL=...      # 可选，Gemini 等原生 provider 无需
LLM_{NAME}_API_KEY=...       # 或 LLM_{NAME}_API_KEYS=key1,key2
LLM_{NAME}_MODELS=...        # 逗号分隔
```

**模型名格式**：

- 有 `base_url` 时：无前缀模型（如 `gpt-4o-mini`）自动加 `openai/` 前缀
- Gemini 等原生 provider（无 base_url）：必须写完整格式，如 `gemini/gemini-2.5-flash`

完整示例见 [.env.example](../.env.example) 第 87–102 行。

### 3.2 YAML 模式（LITELLM_CONFIG）

适用于复杂路由、多 deployment、标准 LiteLLM 格式。参考 [litellm_config.example.yaml](../litellm_config.example.yaml)。

密钥引用格式：`api_key: "os.environ/ENV_VAR_NAME"` — 从环境变量读取，避免明文写入文件。

### 3.3 9 个预设

| 预设 Key | 显示名 | Base URL | 典型模型（参考 LLMChannelEditor 占位符） | 获取 Key 链接 |
|----------|--------|----------|------------------------------------------|---------------|
| aihubmix | AIHubmix | https://aihubmix.com/v1 | gpt-4o-mini, claude-3-5-sonnet, qwen-plus | [aihubmix.com](https://aihubmix.com/?aff=CfMq) |
| deepseek | DeepSeek | https://api.deepseek.com/v1 | deepseek-chat, deepseek-reasoner | [platform.deepseek.com](https://platform.deepseek.com) |
| dashscope | 通义千问 | https://dashscope.aliyuncs.com/compatible-mode/v1 | qwen-plus, qwen-turbo | [dashscope.aliyun.com](https://dashscope.aliyun.com) |
| zhipu | 智谱 GLM | https://open.bigmodel.cn/api/paas/v4 | glm-4-flash, glm-4-plus | [open.bigmodel.cn](https://open.bigmodel.cn) |
| moonshot | Moonshot | https://api.moonshot.cn/v1 | moonshot-v1-8k | [platform.moonshot.cn](https://platform.moonshot.cn) |
| siliconflow | SiliconFlow | https://api.siliconflow.cn/v1 | deepseek-ai/DeepSeek-V3 | [siliconflow.cn](https://siliconflow.cn) |
| openrouter | OpenRouter | https://openrouter.ai/api/v1 | gpt-4o, claude-3.5-sonnet | [openrouter.ai](https://openrouter.ai) |
| gemini | Gemini | （空，原生） | gemini/gemini-2.5-flash | [aistudio.google.com](https://aistudio.google.com) |
| custom | 自定义 | 用户填写 | 用户填写 | - |

---

## 4. 扩展功能

### 4.1 Vision 模型（图片识别股票代码）

从图片提取股票代码（如「从图片添加」功能）使用 LiteLLM Vision。

- **`VISION_MODEL`**：图片识别专用模型，如 `gemini/gemini-2.0-flash`、`openai/gpt-4o`
- **`VISION_PROVIDER_PRIORITY`**：默认 `gemini,anthropic,openai`，主模型失败时按此顺序回退
- **主模型非 Vision 时**：若主模型为 DeepSeek 等非 Vision 模型，可显式配置 `VISION_MODEL` 供图片提取使用
- **校验**：若配置了 `VISION_MODEL` 但未配置对应 provider 的 API Key，`validate_structured` 输出 warning

### 4.2 Agent 模式下的 LLM

Agent 策略问股模式（`AGENT_MODE=true`）下：

- **Reasoning 模型**：deepseek-reasoner、Gemini 3 等需 `thought_signature` 透传，系统已通过 LiteLLM 自动处理
- **`LITELLM_MODEL`**：必须带 provider 前缀
- **多 Key + 跨模型降级**：主模型多 Key 轮换，全部失败时按 `LITELLM_FALLBACK_MODELS` 切换，详见 [完整指南 - LiteLLM 直接集成](full-guide.md#litellm-直接集成多模型--多-key-负载均衡)

### 4.3 Web 设置页渠道编辑器

- **路径**：系统设置 → AI 模型 → 渠道编辑器
- **功能**：添加/编辑/删除渠道；预设下拉选择；保存后写入 `LLM_*` 环境变量
- 与 `.env` 手动配置等效，二选一即可

### 4.4 配置校验与排错

**`python test_env.py --config` 输出解读**：

| 符号 | severity | 含义 |
|------|----------|------|
| ✗ | error | 必须修复，否则功能不可用 |
| ⚠ | warning | 建议修复，部分功能受限 |
| · | info | 提示信息，可忽略 |

**常见 issue 与修复**：

| 提示 | 修复 |
|------|------|
| 未配置任何 LLM | 配置 `LITELLM_CONFIG` / `LLM_CHANNELS` 或至少一个 `*_API_KEY` |
| LITELLM_MODEL 未配置 | 建议配置，格式如 `gemini/gemini-2.5-flash` |
| VISION_MODEL 已配置但未找到可用 Vision API Key | 配置对应 provider 的 API Key（Gemini/Anthropic/OpenAI） |
| 未配置通知渠道 | 配置至少一个推送渠道 |
| OPENAI_VISION_MODEL 已废弃 | 改用 `VISION_MODEL` |

**常见运行时错误**：

| 错误 | 可能原因 | 建议 |
|------|----------|------|
| 400 | 模型/代理兼容、thought_signature 等 | 检查模型名格式、代理配置 |
| 429 | API 限流 | 配置多 Key 负载均衡 |
| timeout | 网络或服务延迟 | 检查代理、重试 |
| invalid API key | Key 错误或过期 | 重新获取 Key |

---

## 5. 迁移与兼容

### 从 legacy 迁移到渠道

1. 确定要迁移的 provider（如 Gemini、DeepSeek）
2. 设置 `LLM_CHANNELS=gemini`（或对应名称）
3. 配置 `LLM_GEMINI_API_KEY`、`LLM_GEMINI_MODELS` 等
4. 移除或注释原 `GEMINI_API_KEY`（渠道生效后 legacy 被忽略）

### 从渠道迁移到 YAML

适用于需要更细粒度路由、多 deployment、标准 LiteLLM 配置的场景。参考 [litellm_config.example.yaml](../litellm_config.example.yaml)，将渠道配置改写为 `model_list` 格式，并设置 `LITELLM_CONFIG=./litellm_config.yaml`。

### 向后兼容

现有单 Key 配置（`GEMINI_API_KEY`、`DEEPSEEK_API_KEY`、`AIHUBMIX_KEY` 等）**无需改动**。`GEMINI_MODEL`、`OPENAI_MODEL` 等 legacy 字段仍有效，仅推荐逐步迁移至 `LITELLM_MODEL`。
