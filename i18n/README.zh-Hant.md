[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> 這些腳本會先執行 `ls -la`，再請 Codex 分析清單內容。

## 概覽

此儲存庫提供可直接落地的 Codex CLI 工作流程輔助工具：
- 使用 Bash 或 TypeScript，讓 Codex 分析目前目錄清單。
- 在多次執行間保存並恢復 Codex exec session。
- 透過 schema 強制約束，將大型任務拆分為可驗證的小型 JSON 步驟。

此儲存庫同時包含更廣泛的 Codex 驅動開發代理之早期產品願景與 SDK 筆記。

### 快速總覽

| 區塊 | 可獲得內容 |
|---|---|
| 🔁 Session 延續 | 支援恢復最近 session、指定 session ID、或使用持久化 session 檔案 |
| 📤 輸出處理 | 支援 JSONL 串流模式與最終訊息匯出 |
| 🧩 結構化規劃 | 以 JSON schema 約束的任務拆分流程 |
| 🛠️ 雙實作 | 以 Shell 與 TypeScript 兩種入口分析清單 |
| 📚 專案筆記 | `docs/` 內含產品願景與 Codex SDK 筆記 |

## 功能

- 具 session 感知的 Codex 執行：
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- 輸出控制：
  - `--json` 事件串流直通
  - `--output-last-message <path>`
  - `--prompt <text>` 自訂提示前綴
- 具 schema 約束的任務規劃腳本：
  - `--task` 或 `--file`
  - `--schema` 覆寫
  - `--out` 輸出檔案
- 清單分析同時提供 shell 與 TypeScript 入口。

## 專案結構

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

## Session 行為

`codex exec` 預設會啟動新的非互動 session，除非你明確指定恢復既有 session。若要延續先前 session，請使用 `codex exec resume --last` 或 `codex exec resume <SESSION_ID>`。你可以透過互動式 `codex resume` 選擇器、session 內的 `/status` 指令，或 `~/.codex/sessions/` 找到 session ID。

這些腳本也支援 `--session-file <path>` 來持久化 session ID。首次執行時會建立新 session 並儲存 ID，後續執行時會重複使用。

你可以用 `--session-mode` 控制 session 行為：
- `auto`（預設）：若 session 檔案存在則恢復，否則建立新 session
- `new`：永遠建立新 session（若提供 session 檔案會覆寫）
- `resume`：必須有既有 session（來源為 `--session-file`、`--session` 或 `--resume-last`）

## 先決條件

| 需求 | 必要原因 |
|---|---|
| `codex` CLI 位於 `PATH` | 所有輔助腳本都需要 |
| Git 儲存庫環境（或 `--skip-git-check`） | 腳本會避免在非 repo 環境誤執行 |
| `python3`（或 `python`）供 `scripts/codex_analyze_ls.sh` 使用 | 初始化/擷取 session 輸出時需要 JSON 解析 |
| Node.js 18+（供 `scripts/codex_analyze_ls.ts` 使用） | TypeScript 入口建議執行環境 |

## 安裝

1. 複製此儲存庫。
2. 安裝 Node 相依套件：

```bash
npm install
```

3. 確認 `codex` CLI 已安裝且可用：

```bash
codex --help
```

4. 可選：若你要在本地使用 `vendor/codex`，請初始化 submodule：

```bash
git submodule update --init --recursive
```

注意：`.gitmodules` 已宣告 `vendor/codex`，但某些 checkout 可能尚未初始化。

## 使用方式

### Shell Script：分析 `ls -la`

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

### 任務拆分腳本

將大型任務拆成可驗證的小步驟並輸出 JSON：

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

使用任務檔並儲存輸出：

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

以自訂 schema 路徑驗證：

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Node TypeScript Script：分析 `ls -la`

執行（使用 `tsx`）：

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

## 設定

### `scripts/codex_analyze_ls.sh` 與 `scripts/codex_analyze_ls.ts`

| 選項 | 說明 |
|---|---|
| `--resume-last` | 恢復最近一次 exec session |
| `--session <id>` | 恢復指定 exec session |
| `--session-file <path>` | 持久化並重用 session ID |
| `--session-mode <auto|new|resume>` | 明確指定 session 策略 |
| `--skip-git-check` | 跳過 Git 儲存庫檢查 |
| `--json` | 輸出 JSONL 事件 |
| `--output-last-message <path>` | 寫出最終 assistant 訊息 |
| `--prompt <text>` | 在附加清單前加入自訂提示前綴 |

兩個 analyze 腳本都會強制以下限制規則：
- `--resume-last` 與 `--session` 互斥。
- `--session-file` 不能與 `--resume-last` 或 `--session` 併用。
- `--session-mode new` 不能與明確的恢復旗標併用。
- `--session-mode resume` 需要 `--session-file`、`--session` 或 `--resume-last`。

### `scripts/codex_task_breakdown.sh`

| 選項 | 說明 |
|---|---|
| `--task <text>` | 內嵌任務文字 |
| `--file <path>` | 從檔案讀取任務文字 |
| `--schema <path>` | Schema 檔案（預設：`schemas/task_breakdown.schema.json`） |
| `--out <path>` | 將最終 JSON 寫入檔案 |
| `--skip-git-check` | 跳過 Git 儲存庫檢查 |

Schema 結構（`schemas/task_breakdown.schema.json`）：
- 頂層必填：`task_summary`、`assumptions`、`steps`、`risks`、`out_of_scope`
- 每個步驟必填：`id`、`title`、`goal`、`verification`、`validation`
- 每個步驟選填：`depends_on`

## 範例

### 跨多次執行持久化並重用 session

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### 只儲存最終 assistant 訊息

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### 產生任務規劃 JSON 成品

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 文件

- `docs/idea.md`：Codex 驅動 app 開發代理的產品願景
- `docs/codex-sdk.md`：Codex SDK 安裝與使用筆記

## 開發備註

- 兩個 analyze 腳本都透過 stdin（`-`）將提示送到 `codex`，可避免 shell quoting 問題。
- 兩個腳本都會把 `Session ID: ...` 印到 stderr，避免干擾 stdout。
- shell 腳本在初始化 session 檔案時，使用 `python3`（或 `python`）解析 JSONL。
- 若需要更深入的程式化控制（threads、可恢復工作流程），可考慮使用 Codex SDK 並在多次執行間保存 thread ID。
- 文件中使用 `npx tsx ...` 來執行 TypeScript 腳本；目前 `package.json` 尚未宣告 `tsx`（可全域安裝或透過 `npx` 執行）。

## 疑難排解

| 症狀 | 可能原因 | 解法 |
|---|---|---|
| `codex CLI not found in PATH` | Codex CLI 未安裝或無法被發現 | 安裝 Codex CLI，並以 `codex --help` 驗證。 |
| `Not inside a Git repo` | 腳本防護機制阻止執行 | 在儲存庫內執行，或加入 `--skip-git-check`。 |
| `Session file is empty or missing` 搭配 `--session-mode resume` | resume 模式需要既有 ID 來源 | 先建立/填入 session 檔案（例如先使用 `--session-mode auto` 或 `--session-mode new`）。 |
| `python3 or python is required`（shell script 路徑） | 缺少用於 JSONL 解析的 Python | 安裝 Python 後重試。 |
| `npx tsx` 問題 | 本地缺少執行期相依 | 直接使用 `npx tsx ...`，或在本地加入 `tsx` 作為 dev dependency。 |

## 路線圖

- 在 `i18n/` 下新增產生後的多語 README，並保持語言導覽同步。
- 為常見流程新增 npm script 別名（`analyze:sh`、`analyze:ts`、`plan:task`）。
- 新增輕量 CI 檢查，用於 shell script lint 與 schema 驗證範例。
- 在 `docs/` 擴充具真實情境的任務規劃範本。

## 貢獻

歡迎貢獻。

建議流程：
1. 建立功能分支。
2. 讓變更聚焦且符合儲存庫實際情況。
3. 當 CLI 行為變更時同步更新文件/範例。
4. 開啟 pull request，說明行為變更與驗證步驟。

## 授權

`package.json` 的套件中繼資料宣告授權為 `ISC`。

注意：在撰寫當下的此份 checkout 中，尚未看到獨立的 `LICENSE` 檔案。
