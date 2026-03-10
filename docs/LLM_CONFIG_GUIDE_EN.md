# LLM Configuration Guide

This document explains the LLM configuration for the AI Stock Analysis System, including the three-tier config priority, quick start, channel mode, Vision model, Agent mode, and config validation troubleshooting.

> For quick start, see [README](../README.md). This document is for advanced configuration.

## Table of Contents

- [1. Quick Start (5 minutes)](#1-quick-start-5-minutes)
- [2. Three-Tier Config Priority](#2-three-tier-config-priority)
- [3. Advanced Configuration](#3-advanced-configuration)
- [4. Extended Features](#4-extended-features)
- [5. Migration and Compatibility](#5-migration-and-compatibility)

---

## 1. Quick Start (5 minutes)

### 1.1 Minimum Configuration

Choose one to run AI analysis:

| Option | Environment Variable | Description |
|--------|----------------------|-------------|
| Gemini | `GEMINI_API_KEY=xxx` | [Google AI Studio](https://aistudio.google.com/) free tier, VPN may be required |
| DeepSeek | `DEEPSEEK_API_KEY=xxx` | [DeepSeek Platform](https://platform.deepseek.com) |
| AIHubmix | `AIHUBMIX_KEY=xxx` | [AIHubmix](https://aihubmix.com/?aff=CfMq) aggregator, one key for multiple models, no VPN |

Multi-key load balancing: `GEMINI_API_KEYS=key1,key2,key3`, `DEEPSEEK_API_KEYS=key1,key2`, etc.

### 1.2 Verification

- **Config check**: `python test_env.py --config` — validates config structure only, no API call
- **Full LLM test**: `python test_env.py --llm` — actually calls the API (requires network, consumes quota)

### 1.3 Scenario Selection

- **Single model** → Scenario A: fill the corresponding API Key
- **Multiple models / platforms / isolated base_url** → Scenario B: use channel mode or YAML mode

### 1.4 Other Entry Points

- **CLI wizard**: `python -m dsa init` — single-model quick config, 9 provider presets
- **Web Settings**: Settings → AI Model → Channel Editor — visual multi-channel config

---

## 2. Three-Tier Config Priority

### 2.1 Priority

```
LITELLM_CONFIG (YAML)  >  LLM_CHANNELS (env)  >  legacy keys
```

Once a higher priority is active, lower priorities are **fully ignored**.

### 2.2 Mode Comparison

| Mode | Use Case | Configuration |
|------|----------|---------------|
| YAML | Complex routing, multi-deployment, standard LiteLLM format | `LITELLM_CONFIG=./litellm_config.yaml` |
| Channels | Multiple models, per-channel base_url/api_key | `LLM_CHANNELS=aihubmix,deepseek,gemini` + `LLM_{NAME}_*` |
| Legacy | Single model, simplest | `GEMINI_API_KEY` / `DEEPSEEK_API_KEY` / `AIHUBMIX_KEY` etc. |

### 2.3 "Do Not Mix" Explanation

Once channels or YAML are configured, the legacy section (`GEMINI_API_KEY`, `OPENAI_API_KEY`, etc.) is **not used**. Conversely, only legacy config means channels and YAML are inactive. The system uses exactly one mode by priority.

### 2.4 Provider Prefix

`LITELLM_MODEL` must be in `provider/model` format, e.g.:

- `gemini/gemini-2.5-flash`
- `openai/gpt-4o-mini`
- `anthropic/claude-3-5-sonnet-20241022`
- `deepseek/deepseek-chat`

Legacy format `GEMINI_MODEL` (no prefix) is only used when `LITELLM_MODEL` is not set.

---

## 3. Advanced Configuration

### 3.1 Channel Mode (LLM_CHANNELS)

Environment variable format:

```
LLM_CHANNELS=aihubmix,deepseek,gemini

LLM_{NAME}_BASE_URL=...      # Optional, native providers like Gemini omit
LLM_{NAME}_API_KEY=...      # Or LLM_{NAME}_API_KEYS=key1,key2
LLM_{NAME}_MODELS=...       # Comma-separated
```

**Model name format**:

- With `base_url`: models without prefix (e.g. `gpt-4o-mini`) are auto-prefixed with `openai/`
- Native providers like Gemini (no base_url): must use full format, e.g. `gemini/gemini-2.5-flash`

Full example: [.env.example](../.env.example) lines 87–102.

### 3.2 YAML Mode (LITELLM_CONFIG)

For complex routing, multi-deployment, standard LiteLLM format. See [litellm_config.example.yaml](../litellm_config.example.yaml).

API key reference: `api_key: "os.environ/ENV_VAR_NAME"` — read from env, avoid plaintext in file.

### 3.3 9 Presets

| Preset Key | Display Name | Base URL | Typical Models (see LLMChannelEditor placeholder) | Get Key |
|------------|---------------|----------|--------------------------------------------------|---------|
| aihubmix | AIHubmix | https://aihubmix.com/v1 | gpt-4o-mini, claude-3-5-sonnet, qwen-plus | [aihubmix.com](https://aihubmix.com/?aff=CfMq) |
| deepseek | DeepSeek | https://api.deepseek.com/v1 | deepseek-chat, deepseek-reasoner | [platform.deepseek.com](https://platform.deepseek.com) |
| dashscope | Qwen (Alibaba) | https://dashscope.aliyuncs.com/compatible-mode/v1 | qwen-plus, qwen-turbo | [dashscope.aliyun.com](https://dashscope.aliyun.com) |
| zhipu | Zhipu GLM | https://open.bigmodel.cn/api/paas/v4 | glm-4-flash, glm-4-plus | [open.bigmodel.cn](https://open.bigmodel.cn) |
| moonshot | Moonshot | https://api.moonshot.cn/v1 | moonshot-v1-8k | [platform.moonshot.cn](https://platform.moonshot.cn) |
| siliconflow | SiliconFlow | https://api.siliconflow.cn/v1 | deepseek-ai/DeepSeek-V3 | [siliconflow.cn](https://siliconflow.cn) |
| openrouter | OpenRouter | https://openrouter.ai/api/v1 | gpt-4o, claude-3.5-sonnet | [openrouter.ai](https://openrouter.ai) |
| gemini | Gemini | (empty, native) | gemini/gemini-2.5-flash | [aistudio.google.com](https://aistudio.google.com) |
| custom | Custom | User-defined | User-defined | - |

---

## 4. Extended Features

### 4.1 Vision Model (Image Stock Code Extraction)

Image-to-stock-code extraction (e.g. "Add from image") uses LiteLLM Vision.

- **`VISION_MODEL`**: Image model, e.g. `gemini/gemini-2.0-flash`, `openai/gpt-4o`
- **`VISION_PROVIDER_PRIORITY`**: Default `gemini,anthropic,openai`, fallback order when primary fails
- **Primary model not Vision**: If primary is DeepSeek etc., set `VISION_MODEL` explicitly for image extraction
- **Validation**: If `VISION_MODEL` is set but no provider API key, `validate_structured` outputs warning

### 4.2 LLM in Agent Mode

In Agent strategy chat (`AGENT_MODE=true`):

- **Reasoning models**: deepseek-reasoner, Gemini 3 etc. need `thought_signature` passthrough; handled by LiteLLM
- **`LITELLM_MODEL`**: Must include provider prefix
- **Multi-key + fallback**: Primary rotates keys; on full failure, uses `LITELLM_FALLBACK_MODELS`; see [Full Guide - LiteLLM Direct Integration](full-guide_EN.md#litellm-direct-integration-multi-model-multi-key-load-balancing)

### 4.3 Web Channel Editor

- **Path**: Settings → AI Model → Channel Editor
- **Features**: Add/edit/delete channels; preset dropdown; saves to `LLM_*` env vars
- Equivalent to manual `.env` config; use either

### 4.4 Config Validation and Troubleshooting

**`python test_env.py --config` output**:

| Symbol | severity | Meaning |
|--------|----------|---------|
| ✗ | error | Must fix, feature unavailable |
| ⚠ | warning | Recommended fix, some features limited |
| · | info | Informational, can ignore |

**Common issues and fixes**:

| Message | Fix |
|---------|-----|
| No LLM configured | Configure `LITELLM_CONFIG` / `LLM_CHANNELS` or at least one `*_API_KEY` |
| LITELLM_MODEL not configured | Recommended: set format like `gemini/gemini-2.5-flash` |
| VISION_MODEL set but no Vision API key | Configure provider API key (Gemini/Anthropic/OpenAI) |
| No notification channel | Configure at least one push channel |
| OPENAI_VISION_MODEL deprecated | Use `VISION_MODEL` instead |

**Common runtime errors**:

| Error | Possible cause | Suggestion |
|-------|----------------|------------|
| 400 | Model/proxy compatibility, thought_signature | Check model format, proxy config |
| 429 | API rate limit | Configure multi-key load balancing |
| timeout | Network or service delay | Check proxy, retry |
| invalid API key | Wrong or expired key | Regenerate key |

---

## 5. Migration and Compatibility

### From Legacy to Channels

1. Identify providers to migrate (e.g. Gemini, DeepSeek)
2. Set `LLM_CHANNELS=gemini` (or corresponding name)
3. Configure `LLM_GEMINI_API_KEY`, `LLM_GEMINI_MODELS`, etc.
4. Remove or comment out original `GEMINI_API_KEY` (legacy ignored when channels active)

### From Channels to YAML

For finer-grained routing, multi-deployment, standard LiteLLM config. See [litellm_config.example.yaml](../litellm_config.example.yaml); convert channel config to `model_list` format and set `LITELLM_CONFIG=./litellm_config.yaml`.

### Backward Compatibility

Existing single-key config (`GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `AIHUBMIX_KEY`, etc.) **requires no changes**. `GEMINI_MODEL`, `OPENAI_MODEL` and other legacy fields are still valid; gradual migration to `LITELLM_MODEL` is recommended.
