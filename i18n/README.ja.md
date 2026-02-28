[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> これらのスクリプトは `ls -la` を実行し、その一覧を Codex に解析させます。

## 概要

このリポジトリは、Codex 駆動ワークフロー向けの実用的な CLI ヘルパーを提供します。
- Bash または TypeScript で、現在のディレクトリ一覧を Codex に解析させる。
- 実行間で Codex exec セッションを永続化し、再開する。
- スキーマで制約された JSON ステップにより、大きなタスクを小さく検証可能な単位に分割する。

あわせて、より広範な Codex ベース開発エージェントに向けた初期プロダクトビジョンと SDK メモも含まれています。

### 一目でわかるポイント

| 領域 | 得られるもの |
|---|---|
| 🔁 セッション継続性 | 直前セッション再開、明示的セッション ID、永続セッションファイル |
| 📤 出力処理 | JSONL ストリームモードと最終メッセージのエクスポート |
| 🧩 構造化プランニング | JSON スキーマ制約付きのタスク分解ワークフロー |
| 🛠️ 2 実装 | 一覧解析の Shell / TypeScript エントリーポイント |
| 📚 プロジェクトノート | `docs/` のプロダクトビジョン + Codex SDK メモ |

## 機能

- セッション対応の Codex 実行:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- 出力制御:
  - `--json` イベントストリームのパススルー
  - `--output-last-message <path>`
  - `--prompt <text>` カスタムプロンプト接頭辞
- スキーマ強制付きタスクプランナースクリプト:
  - `--task` または `--file`
  - `--schema` 上書き
  - `--out` 出力ファイル
- 一覧解析向けの Shell / TypeScript 両エントリーポイント。

## プロジェクト構成

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

## セッション動作

`codex exec` は、明示的に再開を指定しない限り、新しい非対話セッションを開始します。以前のセッションを継続するには、`codex exec resume --last` または `codex exec resume <SESSION_ID>` を使います。セッション ID は、対話型の `codex resume` ピッカー、セッション内の `/status` コマンド、または `~/.codex/sessions/` で確認できます。

これらのスクリプトは `--session-file <path>` によるセッション ID 永続化にも対応しています。初回実行時は新規セッションを開始して ID を保存し、以降の実行で再利用します。

`--session-mode` でセッション動作を制御できます。
- `auto`（デフォルト）: セッションファイルがあれば再開、なければ新規開始
- `new`: 常に新規セッションを開始（指定時はセッションファイルを上書き）
- `resume`: 既存セッションの指定を必須化（`--session-file`、`--session`、`--resume-last` のいずれか）

## 前提条件

| 要件 | 必要な理由 |
|---|---|
| `codex` CLI が `PATH` にあること | すべてのヘルパースクリプトで必須 |
| Git リポジトリ文脈（または `--skip-git-check`） | 非リポジトリでの誤実行を防ぐガードがあるため |
| `scripts/codex_analyze_ls.sh` では `python3`（または `python`） | セッション出力の初期化/取得時の JSON 解析に必要 |
| `scripts/codex_analyze_ls.ts` では Node.js 18+ | TypeScript エントリーポイントの推奨ランタイム |

## インストール

1. リポジトリをクローンします。
2. Node 依存関係をインストールします。

```bash
npm install
```

3. `codex` CLI がインストールされ、利用可能であることを確認します。

```bash
codex --help
```

4. 任意: `vendor/codex` をローカルで参照したい場合はサブモジュールを初期化します。

```bash
git submodule update --init --recursive
```

注: `.gitmodules` では `vendor/codex` が宣言されていますが、チェックアウトによっては未初期化の場合があります。

## 使い方

### Shell Script: `ls -la` を解析

実行:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

その他の例:

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

### Task Breakdown Script

大きなタスクを小さく検証可能なステップに分割し、JSON を出力します。

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

タスクファイルを使って出力を保存:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

カスタムスキーマパスで検証:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Node TypeScript Script: `ls -la` を解析

実行（`tsx` 使用）:

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

その他の例:

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

### `scripts/codex_analyze_ls.sh` と `scripts/codex_analyze_ls.ts`

| オプション | 説明 |
|---|---|
| `--resume-last` | 直近の exec セッションを再開 |
| `--session <id>` | 特定の exec セッションを再開 |
| `--session-file <path>` | セッション ID を永続化して再利用 |
| `--session-mode <auto|new|resume>` | セッション戦略を明示 |
| `--skip-git-check` | Git リポジトリチェックをバイパス |
| `--json` | JSONL イベントを出力 |
| `--output-last-message <path>` | 最終アシスタントメッセージを書き出し |
| `--prompt <text>` | 一覧付与前のカスタムプロンプト接頭辞 |

両 analyze スクリプトで適用される制約ルール:
- `--resume-last` と `--session` は同時指定不可。
- `--session-file` は `--resume-last` または `--session` と併用不可。
- `--session-mode new` は明示的な再開フラグと併用不可。
- `--session-mode resume` では `--session-file`、`--session`、`--resume-last` のいずれかが必要。

### `scripts/codex_task_breakdown.sh`

| オプション | 説明 |
|---|---|
| `--task <text>` | インラインタスク |
| `--file <path>` | ファイルからタスクテキストを読み込み |
| `--schema <path>` | スキーマファイル（デフォルト: `schemas/task_breakdown.schema.json`） |
| `--out <path>` | 最終 JSON をファイル出力 |
| `--skip-git-check` | Git リポジトリチェックをバイパス |

スキーマ形状（`schemas/task_breakdown.schema.json`）:
- トップレベル必須: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- 各ステップ必須: `id`, `title`, `goal`, `verification`, `validation`
- 各ステップ任意: `depends_on`

## 例

### 実行間でセッションを永続化して再利用

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### 最終アシスタントメッセージのみ保存

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### タスク計画の JSON 成果物を生成

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## ドキュメント

- `docs/idea.md`: Codex ベースのアプリ開発エージェント向けプロダクトビジョン
- `docs/codex-sdk.md`: Codex SDK のインストールおよび利用メモ

## 開発メモ

- 両 analyze スクリプトは `codex` へ標準入力（`-`）でプロンプトを渡し、シェルのクオート問題を回避しています。
- 両スクリプトは `Session ID: ...` を stderr に出力し、stdout への混入を防ぎます。
- シェルスクリプトは、セッションファイル初期化時の JSONL 解析に `python3`（または `python`）を使います。
- より深いプログラム制御（スレッド、再開可能ワークフロー）が必要なら、Codex SDK を使い、実行間でスレッド ID を保存することを検討してください。
- TypeScript スクリプト実行は `npx tsx ...` を案内しています。`tsx` は現在 `package.json` に宣言されていないため、グローバルインストールするか `npx` 経由で実行してください。

## トラブルシューティング

| 症状 | 想定原因 | 解決策 |
|---|---|---|
| `codex CLI not found in PATH` | Codex CLI が未インストール、または検出不可 | Codex CLI をインストールし、`codex --help` で確認してください。 |
| `Not inside a Git repo` | スクリプトのガードで実行がブロックされた | リポジトリ内で実行するか、`--skip-git-check` を付けてください。 |
| `Session file is empty or missing` with `--session-mode resume` | resume モードには既存 ID ソースが必要 | 先にセッションファイルを作成/投入してください（例: `--session-mode auto` または `--session-mode new`）。 |
| `python3 or python is required` (shell script path) | JSONL 解析に必要な Python がない | Python をインストールして再実行してください。 |
| `npx tsx` issues | ローカルでランタイム依存が利用不可 | `npx tsx ...` を直接使うか、`tsx` をローカルの dev dependency に追加してください。 |

## ロードマップ

- `i18n/` 配下に生成した多言語 README を追加し、言語ナビゲーションの同期を維持する。
- 一般的なフロー向け npm スクリプトエイリアス（`analyze:sh`, `analyze:ts`, `plan:task`）を追加する。
- シェルスクリプト lint とスキーマ検証例の軽量 CI チェックを追加する。
- `docs/` で、実運用テンプレートを含むタスクプランナー例を拡充する。

## コントリビュート

コントリビューションを歓迎します。

推奨ワークフロー:
1. フィーチャーブランチを作成する。
2. 変更は焦点を絞り、リポジトリ実態に正確に保つ。
3. CLI 挙動が変わる場合は docs/examples も更新する。
4. 振る舞いの変更点と検証手順を記載してプルリクエストを作成する。

## ライセンス

`package.json` のパッケージメタデータでは、ライセンスは `ISC` と宣言されています。

注: この執筆時点のチェックアウトには、単独の `LICENSE` ファイルは存在しませんでした。
