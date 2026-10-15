[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://lazying.art/media/brand/lazyingart-intro.gif)](https://lazying.art)

# 🧠 Codex 执行助手（LazyingArtAgent）

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 关注点 | 🧰 说明 |
|---|---|
| 会话连续性 | 在多次运行间恢复并持久化 Codex 会话 |
| 输出质量 | JSONL 事件透传 + 最终消息导出 |
| 规划支持 | 采用 schema 约束生成任务拆分 |
| 适用环境 | 本地 Shell 与 CI 友好工作流 |

> 面向 Codex 工作流的实用 CLI 工具，保持会话上下文并强制结构化输出。

## 🎯 概览

本仓库为以 Codex 为中心的工作流提供轻量但实用的命令行工具：

- 使用 Codex 分析当前目录列表。
- 在多次运行之间恢复并继续 Codex 会话。
- 将大任务拆解为受 schema 约束、可验证的步骤。
- 维护使用指南与 SDK 说明，以支撑不断演进的 Codex 工作流思路。

这些工具刻意保持轻量且以脚本优先设计，便于在任何已安装 `codex` 和相关运行环境的环境中运行。

## 🚀 快速能力

### 一览

| 范围 | 可获得能力 |
|---|---|
| 🔁 会话连续性 | 恢复最近一次会话、显式会话 ID，或持久化会话文件 |
| 📤 输出处理 | JSONL 事件流与最终消息导出 |
| 🧩 结构化规划 | 基于 JSON schema 的任务拆分输出 |
| 🛠️ 双入口 | Bash 与 TypeScript 实现 |
| 📚 内置上下文 | `docs/` 中的项目指南 |

### 🧩 功能特性

- 具备会话感知的 Codex 执行：
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- 输出控制：
  - `--json` 事件流透传
  - `--output-last-message <path>`
  - `--prompt <text>` 自定义提示前缀
- 具备 schema 约束的任务规划脚本：
  - `--task` 或 `--file`
  - `--schema` 覆盖
  - `--out` 输出文件
- 同时提供用于列表分析的 shell 与 TypeScript 入口。

## 🧱 项目结构

```text
.
├─ README.md
├─ package.json
├─ package-lock.json
├─ .gitmodules
├─ scripts/
│  ├─ codex_analyze_ls.sh
│  ├─ codex_analyze_ls.ts
│  └─ codex_task_breakdown.sh
├─ schemas/
│  └─ task_breakdown.schema.json
├─ docs/
│  ├─ idea.md
│  └─ codex-sdk.md
├─ i18n/
└─ vendor/
   └─ codex/ (git submodule)
```

## ✅ 前置条件

| 要求 | 作用 |
|---|---|
| `PATH` 中存在 `codex` CLI | 所有辅助脚本都依赖该命令 |
| Git 仓库上下文（或 `--skip-git-check`） | 脚本会避免在非仓库中误运行 |
| `python3`（或 `python`）用于 `scripts/codex_analyze_ls.sh` | 初始化或保存会话输出时用于解析 JSON |
| Node.js 18+ 用于 `scripts/codex_analyze_ls.ts` | TypeScript 入口的运行时 |

## 🔧 安装

1. 克隆仓库。

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. 安装 Node 依赖。

   ```bash
   npm install
   ```

3. 确认 Codex CLI 可用。

   ```bash
   codex --help
   ```

4. （可选）如需本地使用 `vendor/codex`，初始化子模块。

   ```bash
   git submodule update --init --recursive
   ```

假设：`<repository-url>` 是你的 Git 远端地址，请替换为实际源地址。

## 🛠️ 用法

### Shell 脚本：分析 `ls -la`

运行：

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

其他示例：

```bash
scripts/codex_analyze_ls.sh --resume-last
scripts/codex_analyze_ls.sh --session SESSION_ID
scripts/codex_analyze_ls.sh --session-file .codex_session
scripts/codex_analyze_ls.sh --session-mode new --session-file .codex_session
scripts/codex_analyze_ls.sh --session-mode resume --session-file .codex_session
scripts/codex_analyze_ls.sh --json
scripts/codex_analyze_ls.sh --output-last-message out.txt
scripts/codex_analyze_ls.sh --prompt "Summarize the listing"
```

### 🧭 任务拆分脚本

将一个大任务拆成可验证的小步骤并输出 JSON：

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

使用任务文件并保存输出：

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

使用自定义 schema 路径验证：

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### ⚙️ Node TypeScript 脚本：分析 `ls -la`

运行（使用 `tsx`）：

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

其他示例：

```bash
npx tsx scripts/codex_analyze_ls.ts --resume-last
npx tsx scripts/codex_analyze_ls.ts --session SESSION_ID
npx tsx scripts/codex_analyze_ls.ts --session-file .codex_session
npx tsx scripts/codex_analyze_ls.ts --session-mode new --session-file .codex_session
npx tsx scripts/codex_analyze_ls.ts --session-mode resume --session-file .codex_session
npx tsx scripts/codex_analyze_ls.ts --json
npx tsx scripts/codex_analyze_ls.ts --output-last-message out.txt
npx tsx scripts/codex_analyze_ls.ts --prompt "Summarize the listing"
```

## 🔁 会话行为

除非你显式恢复会话，否则 `codex exec` 会启动一个新的非交互式会话。要继续之前会话，请使用 `codex exec resume --last` 或 `codex exec resume <SESSION_ID>`。你可以通过交互式 `codex resume` 选择器、会话内的 `/status` 命令，或 `~/.codex/sessions/` 中获取会话 ID。

这些脚本同样支持 `--session-file <path>` 以持久化会话 ID。首次运行时会启动新会话并保存 ID，后续运行会复用该 ID。

可使用 `--session-mode` 控制会话行为：
- `auto`（默认）：若会话文件存在则恢复，否则启动新会话
- `new`：始终启动新会话（若提供会话文件则覆盖该文件）
- `resume`：要求已存在会话（来自 `--session-file`、`--session` 或 `--resume-last`）

## 🧭 配置

### `scripts/codex_analyze_ls.sh` 与 `scripts/codex_analyze_ls.ts`

| 选项 | 说明 |
|---|---|
| `--resume-last` | 恢复最近一次 exec 会话 |
| `--session <id>` | 恢复指定 exec 会话 |
| `--session-file <path>` | 持久化并复用会话 ID |
| `--session-mode <auto|new|resume>` | 显式设置会话策略 |
| `--skip-git-check` | 跳过 Git 仓库检查 |
| `--json` | 输出 JSONL 事件 |
| `--output-last-message <path>` | 写入最终助手消息 |
| `--prompt <text>` | 在追加列表前添加自定义提示前缀 |

两个分析脚本都强制执行以下约束：
- `--resume-last` 与 `--session` 不可同时使用。
- `--session-file` 不能与 `--resume-last` 或 `--session` 组合使用。
- `--session-mode new` 不能与显式恢复参数组合使用。
- `--session-mode resume` 需要 `--session-file`、`--session` 或 `--resume-last`。

### `scripts/codex_task_breakdown.sh`

| 选项 | 说明 |
|---|---|
| `--task <text>` | 行内任务文本 |
| `--file <path>` | 从文件读取任务文本 |
| `--schema <path>` | schema 文件（默认：`schemas/task_breakdown.schema.json`） |
| `--out <path>` | 将最终 JSON 写入文件 |
| `--skip-git-check` | 跳过 Git 仓库检查 |

Schema 结构（`schemas/task_breakdown.schema.json`）：
- 顶层必填项：`task_summary`、`assumptions`、`steps`、`risks`、`out_of_scope`
- 每步必填项：`id`、`title`、`goal`、`verification`、`validation`
- 每步可选项：`depends_on`

## 📎 示例

### 跨多次运行持久化并复用会话

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### 仅保存最终助手消息

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### 生成任务计划 JSON 工件

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 📚 文档

- `docs/idea.md`：Codex 驱动应用开发代理的产品愿景
- `docs/codex-sdk.md`：Codex SDK 安装与使用说明

## 🧪 开发说明

- 两个分析脚本都通过 `stdin`（`-`）向 `codex` 发送 prompt，以避免 shell 引号处理边界问题。
- 两个脚本都会将 `Session ID: ...` 打印到 `stderr`，避免干扰可解析的 `stdout` 输出。
- Shell 脚本在初始化或保存会话状态时使用 `python3`（或 `python`）解析 JSONL。
- 如需更深度的程序化控制（线程持久化、恢复工作流），可参考 `docs/codex-sdk.md` 中的 Codex SDK 说明。
- 文档中采用 `npx tsx ...` 运行 TypeScript 脚本；`tsx` 当前未作为 `package.json` 的直接依赖声明。

## 🧯 故障排查

| 症状 | 可能原因 | 解决方案 |
|---|---|---|
| `codex CLI not found in PATH` | 未安装或未被系统发现 `codex` | 安装 Codex CLI 并用 `codex --help` 验证。 |
| `Not inside a Git repo` | 脚本保护机制拦截执行 | 在仓库内运行，或传入 `--skip-git-check`。 |
| `Session file is empty or missing` 且使用 `--session-mode resume` | 恢复模式需要已有的 ID 来源 | 先创建并初始化会话文件（例如先用 `--session-mode auto` 或 `--session-mode new`）。 |
| `python3 or python is required` | Shell 脚本依赖的 Python 解析路径缺失 | 安装 Python 后重试。 |
| `npx tsx` 问题 | 本地运行时依赖缺失 | 直接运行 `npx tsx ...`，或在本地添加 `tsx` 到开发依赖。 |

## 🗺️ 路线图

- 在 `i18n/` 下添加生成的多语言 README 文件并保持语言导航同步。
- 为常见流程补充 npm 脚本别名（`analyze:sh`、`analyze:ts`、`plan:task`）。
- 增加轻量 CI 检查，用于 shell 脚本 lint 和 schema 校验。
- 在 `docs/` 中扩展任务规划器的真实场景模板。

## 🤝 贡献

欢迎提交贡献。

建议流程：
1. 创建功能分支。
2. 保持改动聚焦且与仓库实际一致。
3. 当 CLI 行为发生变化时更新文档和示例。
4. 提交说明行为变化与验证步骤的 Pull Request。

## ❤️ Support

<!-- support:start -->
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsors-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/lachlanchen)
[![LazyingArt Support](https://img.shields.io/badge/LazyingArt-Support-0EA5E9?style=for-the-badge)](https://chat.lazying.art/donate)
[![PayPal Support](https://img.shields.io/badge/PayPal-Support-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/RongzhouChen)
[![Stripe Support](https://img.shields.io/badge/Stripe-Support-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400)
<!-- support:end -->

## License

`package.json` 声明的包元数据显示许可证为 `ISC`。

说明：在当前检出中未包含独立的 `LICENSE` 文件。
