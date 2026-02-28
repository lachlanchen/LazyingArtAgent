[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> 这些脚本会先运行 `ls -la`，然后让 Codex 分析目录列表。

## 概览

本仓库为 Codex 驱动的工作流提供实用的 CLI 辅助脚本：
- 使用 Bash 或 TypeScript 结合 Codex 分析当前目录列表。
- 在多次运行之间持久化并恢复 Codex exec 会话。
- 通过 Schema 约束，将大型任务拆解为可验证的小型 JSON 步骤。

本仓库还包含了更广泛的 Codex 驱动开发代理的早期产品愿景与 SDK 说明。

### 快速一览

| 区域 | 你将获得什么 |
|---|---|
| 🔁 会话连续性 | 恢复最近会话、显式会话 ID、或持久化会话文件 |
| 📤 输出处理 | JSONL 流模式与最终消息导出 |
| 🧩 结构化规划 | 受 JSON Schema 约束的任务拆解工作流 |
| 🛠️ 双实现 | 用于列表分析的 Shell 与 TypeScript 双入口 |
| 📚 项目说明 | `docs/` 中的产品愿景 + Codex SDK 说明 |

## 功能特性

- 具备会话感知的 Codex 执行：
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- 输出控制：
  - `--json` 事件流透传
  - `--output-last-message <path>`
  - `--prompt <text>` 自定义提示前缀
- 带 Schema 约束的任务规划脚本：
  - `--task` 或 `--file`
  - `--schema` 覆盖默认 Schema
  - `--out` 输出文件
- 同时提供用于列表分析的 shell 与 TypeScript 入口。

## 项目结构

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

## 会话行为

`codex exec` 默认会启动一个新的非交互式会话，除非你显式恢复已有会话。若要继续先前会话，请使用 `codex exec resume --last` 或 `codex exec resume <SESSION_ID>`。你可以通过交互式 `codex resume` 选择器、会话内的 `/status` 命令，或 `~/.codex/sessions/` 中的信息获取会话 ID。

这些脚本也支持 `--session-file <path>` 来持久化会话 ID。首次运行时会启动新会话并保存 ID，后续运行将复用该 ID。

你可以通过 `--session-mode` 控制会话行为：
- `auto`（默认）：若会话文件存在则恢复，否则新建会话
- `new`：始终新建会话（若提供会话文件将覆盖其内容）
- `resume`：要求必须存在可恢复的会话（来自 `--session-file`、`--session` 或 `--resume-last`）

## 前置要求

| 要求 | 需要原因 |
|---|---|
| `codex` CLI 位于 `PATH` 中 | 所有辅助脚本都依赖它 |
| Git 仓库上下文（或使用 `--skip-git-check`） | 脚本会防止误在非仓库目录运行 |
| `python3`（或 `python`）用于 `scripts/codex_analyze_ls.sh` | 初始化/捕获会话输出时需要进行 JSON 解析 |
| Node.js 18+ 用于 `scripts/codex_analyze_ls.ts` | TypeScript 入口推荐运行环境 |

## 安装

1. 克隆仓库。
2. 安装 Node 依赖：

```bash
npm install
```

3. 确保已安装并可使用 `codex` CLI：

```bash
codex --help
```

4. 可选：若要在本地访问 `vendor/codex`，初始化子模块：

```bash
git submodule update --init --recursive
```

说明：`.gitmodules` 声明了 `vendor/codex`，但某些检出状态下它可能尚未初始化。

## 用法

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

### 任务拆解脚本

将大型任务拆分为可验证的小步骤，并输出 JSON：

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

使用任务文件并保存输出：

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

使用自定义 Schema 路径进行验证：

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Node TypeScript 脚本：分析 `ls -la`

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

## 配置

### `scripts/codex_analyze_ls.sh` 和 `scripts/codex_analyze_ls.ts`

| 选项 | 说明 |
|---|---|
| `--resume-last` | 恢复最近一次 exec 会话 |
| `--session <id>` | 恢复指定 exec 会话 |
| `--session-file <path>` | 持久化并复用会话 ID |
| `--session-mode <auto|new|resume>` | 显式指定会话策略 |
| `--skip-git-check` | 跳过 Git 仓库检查 |
| `--json` | 输出 JSONL 事件 |
| `--output-last-message <path>` | 写出助手最终消息 |
| `--prompt <text>` | 在追加列表前设置自定义提示前缀 |

两个分析脚本共同强制的约束规则：
- `--resume-last` 与 `--session` 互斥。
- `--session-file` 不能与 `--resume-last` 或 `--session` 同时使用。
- `--session-mode new` 不能与显式恢复参数组合使用。
- `--session-mode resume` 要求提供 `--session-file`、`--session` 或 `--resume-last`。

### `scripts/codex_task_breakdown.sh`

| 选项 | 说明 |
|---|---|
| `--task <text>` | 内联任务文本 |
| `--file <path>` | 从文件读取任务文本 |
| `--schema <path>` | Schema 文件（默认：`schemas/task_breakdown.schema.json`） |
| `--out <path>` | 将最终 JSON 写入文件 |
| `--skip-git-check` | 跳过 Git 仓库检查 |

Schema 结构（`schemas/task_breakdown.schema.json`）：
- 顶层必填：`task_summary`、`assumptions`、`steps`、`risks`、`out_of_scope`
- 每个步骤必填：`id`、`title`、`goal`、`verification`、`validation`
- 每个步骤可选：`depends_on`

## 示例

### 在多次运行间持久化并复用会话

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### 仅保存助手最终消息

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### 生成任务计划 JSON 产物

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 文档

- `docs/idea.md`：Codex 驱动应用开发代理的产品愿景
- `docs/codex-sdk.md`：Codex SDK 安装与使用说明

## 开发说明

- 两个分析脚本都通过 stdin（`-`）将提示发送给 `codex`，可避免 shell 引号转义问题。
- 两个脚本都会将 `Session ID: ...` 打印到 stderr，避免干扰 stdout。
- shell 脚本在初始化会话文件时使用 `python3`（或 `python`）解析 JSONL。
- 若需要更深的编程式控制（线程、可恢复工作流），可考虑使用 Codex SDK，并在多次运行间存储线程 ID。
- 文档展示了使用 `npx tsx ...` 运行 TypeScript 脚本；当前 `package.json` 尚未声明 `tsx`（可全局安装，或通过 `npx` 运行）。

## 故障排查

| 症状 | 可能原因 | 解决方法 |
|---|---|---|
| `codex CLI not found in PATH` | Codex CLI 未安装或不可发现 | 安装 Codex CLI，并用 `codex --help` 验证。 |
| `Not inside a Git repo` | 脚本保护机制阻止执行 | 在仓库目录中运行，或传入 `--skip-git-check`。 |
| `Session file is empty or missing` with `--session-mode resume` | 恢复模式要求已有可用 ID 来源 | 先创建/写入会话文件（例如先用 `--session-mode auto` 或 `--session-mode new`）。 |
| `python3 or python is required` (shell script path) | 解析 JSONL 所需 Python 缺失 | 安装 Python 后重试。 |
| `npx tsx` issues | 本地缺少运行时依赖 | 直接使用 `npx tsx ...`，或在本地将 `tsx` 添加为开发依赖。 |

## 路线图

- 在 `i18n/` 下添加生成的多语言 README，并保持语言导航同步。
- 为常见流程添加 npm 脚本别名（`analyze:sh`、`analyze:ts`、`plan:task`）。
- 增加轻量 CI 检查，用于 shell 脚本 lint 以及 Schema 验证示例。
- 在 `docs/` 中扩展任务规划器的真实场景模板示例。

## 贡献

欢迎贡献。

建议流程：
1. 创建功能分支。
2. 让改动聚焦且与仓库实际情况一致。
3. 当 CLI 行为变化时同步更新文档/示例。
4. 提交 Pull Request，说明行为变更和验证步骤。

## 许可证

`package.json` 中的包元数据声明许可证为 `ISC`。

说明：在撰写本文时，此检出版本中未包含独立的 `LICENSE` 文件。
