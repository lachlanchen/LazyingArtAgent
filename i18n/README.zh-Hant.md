[![LazyingArt banner](https://github.com/lachlanchen/lachlanchen/raw/main/figs/banner.png)](https://github.com/lachlanchen/lachlanchen/blob/main/figs/banner.png)

[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner](https://github.com/lachlanchen/lazyingart/raw/main/figs/banner.png)](https://github.com/lachlanchen/lazyanart/blob/main/figs/banner.png)

# 🧠 Codex 執行助手（LazyingArtAgent）

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 焦點 | 🧰 說明 |
|---|---|
| 會話連續性 | 在多次執行間恢復並保存 Codex 會話 |
| 輸出品質 | JSONL 事件透傳 + 最終訊息匯出 |
| 規劃支援 | 以 schema 約束產生可驗證的任務拆解 |
| 適用環境 | 本機 Shell 與 CI 相容的工作流程 |

> 實用的 CLI 輔助工具，讓 Codex 工作流程能保留會話脈絡並維持結構化輸出。

## 🎯 概覽

本儲存庫提供小而實用的命令列工具，協助 Codex 流程化作業：

- 以 Codex 分析目前目錄清單。
- 在多次執行間恢復並繼續 Codex 會話。
- 將大型任務拆解為受 schema 約束、可驗證的步驟。
- 針對持續演進的 Codex 工作流，保留使用說明與 SDK 筆記。

這些工具刻意保持輕量且以腳本為先，讓你能在任何可執行 `codex` 且具備必要執行環境的環境中使用。

## 🚀 快速能力

### 一覽

| 領域 | 你會得到什麼 |
|---|---|
| 🔁 會話連續性 | 復原最近一次會話、明確指定會話 ID，或使用持久化會話檔 |
| 📤 輸出控管 | JSONL 事件串流與最終訊息匯出 |
| 🧩 結構化規劃 | 以 JSON schema 驗證的任務拆分輸出 |
| 🛠️ 雙進入點 | Bash 與 TypeScript 實作 |
| 📚 內嵌脈絡 | `docs/` 中的專案指引 |

### 🧩 功能

- 具備會話感知的 Codex 執行：
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- 輸出控制：
  - `--json` 事件流透傳
  - `--output-last-message <path>`
  - `--prompt <text>` 自訂提示前綴
- 具備 schema 強制條件的任務規劃腳本：
  - `--task` 或 `--file`
  - `--schema` 覆寫
  - `--out` 輸出檔案
- 列表分析提供 Shell 與 TypeScript 兩種進入點。

## 🧱 專案結構

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

## ✅ 前置需求

| 需求 | 為何需要 |
|---|---|
| `PATH` 中的 `codex` CLI | 所有輔助腳本皆需要它 |
| Git 倉庫環境（或 `--skip-git-check`） | 腳本會避免在非 Git 專案中誤執行 |
| `python3`（或 `python`）用於 `scripts/codex_analyze_ls.sh` | 初始化/保存會話輸出時需要解析 JSON |
| Node.js 18+ 用於 `scripts/codex_analyze_ls.ts` | TypeScript 入口的執行時 |

## 🔧 安裝

1. 複製本倉庫。

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. 安裝 Node 相依套件。

   ```bash
   npm install
   ```

3. 確認 Codex CLI 可用。

   ```bash
   codex --help
   ```

4. （選填）若你需要 `vendor/codex`，請初始化子模組。

   ```bash
   git submodule update --init --recursive
   ```

假設：`<repository-url>` 為你的 Git 遠端位址，請換成實際來源。

## 🛠️ 使用方法

### Shell 腳本：分析 `ls -la`

執行：

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

其他範例：

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

### 🧭 任務拆解腳本

將大任務拆成小而可驗證的步驟，並輸出 JSON：

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

使用任務檔並保存輸出：

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

使用自訂 schema 路徑驗證：

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### ⚙️ Node TypeScript 腳本：分析 `ls -la`

執行（搭配 `tsx`）：

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

其他範例：

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

## 🔁 會話行為

`codex exec` 會在未明確恢復時啟動新的非互動式會話。要繼續先前會話，請使用 `codex exec resume --last` 或 `codex exec resume <SESSION_ID>`。你可在互動式 `codex resume` 選單、會話內的 `/status` 指令，或 `~/.codex/sessions/` 中找到會話 ID。

這些腳本也支援 `--session-file <path>` 來持久化會話 ID。首次執行會啟動新會話、儲存 ID，接著在後續執行中重複使用。

你可以用 `--session-mode` 控制會話行為：
- `auto`（預設）：若會話檔存在就恢復，否則啟動新會話
- `new`：總是啟動新會話（若有提供會話檔，會覆寫該檔案）
- `resume`：必須有既有會話，來源可為 `--session-file`、`--session` 或 `--resume-last`

## 🧭 組態設定

### `scripts/codex_analyze_ls.sh` 與 `scripts/codex_analyze_ls.ts`

| 選項 | 說明 |
|---|---|
| `--resume-last` | 復原最近一次 exec 會話 |
| `--session <id>` | 復原特定 exec 會話 |
| `--session-file <path>` | 持久化並重複使用會話 ID |
| `--session-mode <auto|new|resume>` | 明確會話策略 |
| `--skip-git-check` | 略過 Git 倉庫檢查 |
| `--json` | 輸出 JSONL 事件 |
| `--output-last-message <path>` | 寫入最終助手訊息 |
| `--prompt <text>` | 在附加清單前加上自訂提示前綴 |

兩個分析腳本會強制以下限制：
- `--resume-last` 與 `--session` 不能同時使用。
- `--session-file` 不能與 `--resume-last` 或 `--session` 組合使用。
- `--session-mode new` 不能與明確復原旗標組合使用。
- `--session-mode resume` 需要 `--session-file`、`--session` 或 `--resume-last`。

### `scripts/codex_task_breakdown.sh`

| 選項 | 說明 |
|---|---|
| `--task <text>` | 內嵌任務文字 |
| `--file <path>` | 從檔案讀取任務文字 |
| `--schema <path>` | Schema 檔（預設：`schemas/task_breakdown.schema.json`） |
| `--out <path>` | 將最終 JSON 寫入檔案 |
| `--skip-git-check` | 略過 Git 倉庫檢查 |

Schema 結構（`schemas/task_breakdown.schema.json`）：
- 最上層必填：`task_summary`、`assumptions`、`steps`、`risks`、`out_of_scope`
- 每一步必填：`id`、`title`、`goal`、`verification`、`validation`
- 每一步選填：`depends_on`

## 📎 範例

### 在多次執行中持久化並重複使用會話

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### 只保存最終助手訊息

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### 生成任務計畫 JSON 成果檔

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 📚 文件

- `docs/idea.md`：Codex 驅動應用開發代理的產品願景
- `docs/codex-sdk.md`：Codex SDK 安裝與使用備註

## 🧪 開發備註

- 兩個分析腳本都透過 stdin（`-`）將 Codex 提示詞傳給 `codex`，以避免 shell 引號界線問題。
- 兩個腳本都會將 `Session ID: ...` 輸出到 `stderr`，避免影響可解析的 `stdout` 輸出。
- Shell 腳本在初始化或保存會話狀態時，使用 `python3`（或 `python`）解析 JSONL。
- 若要有更深入的程式控制（線程持久化、恢復流程），請參考 `docs/codex-sdk.md` 中的 Codex SDK 筆記。
- 文件使用 `npx tsx ...` 來執行 TypeScript 腳本；目前 `tsx` 並未在 `package.json` 中列為直接相依套件。

## 🧯 疑難排解

| 症狀 | 可能原因 | 解決方式 |
|---|---|---|
| `codex CLI not found in PATH` | 未安裝 `codex` 或未被系統找到 | 安裝 Codex CLI 並以 `codex --help` 驗證。 |
| `Not inside a Git repo` | 腳本保護機制阻止執行 | 改在 Git 倉庫內執行，或傳入 `--skip-git-check`。 |
| `Session file is empty or missing` 且使用 `--session-mode resume` | 恢復模式需要既有 ID 來源 | 先建立/初始化會話檔（例如先用 `--session-mode auto` 或 `--session-mode new`）。 |
| `python3 or python is required` | Shell 腳本路徑依賴 Python 解析 | 安裝 Python 後再重試。 |
| `npx tsx` 問題 | 本機缺少執行時相依套件 | 直接執行 `npx tsx ...`，或在本機將 `tsx` 加入開發相依。 |

## 🗺️ 發展藍圖

- 在 `i18n/` 下新增多語系 README，並保持語言導覽同步。
- 為常用流程新增 npm script 別名（`analyze:sh`、`analyze:ts`、`plan:task`）。
- 新增輕量 CI 檢查，涵蓋 shell 腳本 lint 與 schema 驗證。
- 在 `docs/` 補充任務規劃器的實務場景範本。

## 🤝 貢獻指南

歡迎貢獻。

建議流程：
1. 建立功能分支。
2. 保持變更聚焦且符合專案現況。
3. CLI 行為改變時，同步更新文件與範例。
4. 提交說明行為變更與驗證步驟的 pull request。

## 授權條款

`package.json` 中宣告的套件授權為 `ISC`。

附註：本次檢出中未包含獨立的 `LICENSE` 檔案。


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
