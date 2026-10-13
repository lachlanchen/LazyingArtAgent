[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://github.com/lachlanchen/LazyingArtWebsite/raw/main/media/brand/lazyingart-intro.gif)](https://lazying.art)

# 🧠 Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 フォーカス | 🧰 詳細 |
|---|---|
| セッション継続性 | 実行をまたいで Codex セッションを再開・永続化 |
| 出力品質 | JSONL イベントのパススルーと最終メッセージのエクスポート |
| 計画支援 | スキーマ制約付きタスク分解の生成 |
| 対応環境 | ローカルシェルおよび CI で使いやすいワークフロー |

> セッション文脈を保持し、構造化された出力を強制する Codex ワークフロー向けの実践的 CLI ヘルパーです。

## 🎯 概要

このリポジトリは、Codex 駆動ワークフロー向けの小さいけれど実務で使えるコマンドラインツール群を提供します。

- 現在のディレクトリ一覧を Codex に解析させる。
- 実行を跨いで Codex セッションを再開・継続する。
- 大きなタスクを、スキーマ制約付きの検証可能なステップに分割する。
- Codex ワークフローのアイデア更新に合わせ、利用手順と SDK ノートを蓄積する。

これらのツールは軽量で、スクリプトファーストに設計されています。`codex` と必要な実行環境があればどこでも使えます。

## 🚀 主な機能

### ひとめでわかる構成

| 領域 | 得られる内容 |
|---|---|
| 🔁 セッション継続性 | 直前セッション再開、明示的なセッション ID、永続セッションファイル |
| 📤 出力処理 | JSONL イベントストリーミングと最終メッセージのエクスポート |
| 🧩 構造化計画 | JSON スキーマ制約付きのタスク分解出力 |
| 🛠️ 2 つのエントリーポイント | Bash と TypeScript の実装 |
| 📚 組み込みコンテキスト | `docs/` にあるプロジェクトガイダンス |

### 🧩 機能

- セッション対応の Codex 実行:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- 出力制御:
  - `--json` イベントストリームのパススルー
  - `--output-last-message <path>`
  - `--prompt <text>` カスタムプロンプト接頭辞
- スキーマ検証付きタスク分解スクリプト:
  - `--task` または `--file`
  - `--schema` 上書き
  - `--out` 出力先
- 一覧解析のための Shell と TypeScript の両エントリポイント

## 🧱 プロジェクト構成

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

## ✅ 前提条件

| 要件 | 必要な理由 |
|---|---|
| `PATH` 上の `codex` CLI | すべてのヘルパースクリプトで必須 |
| Git リポジトリ情報（または `--skip-git-check`） | 非リポジトリ環境での誤実行を防ぐ |
| `scripts/codex_analyze_ls.sh` 用 `python3`（または `python`） | セッション出力の初期化/取得時の JSON 解析が必要 |
| `scripts/codex_analyze_ls.ts` 用 Node.js 18+ | TypeScript エントリポイントの実行環境 |

## 🔧 インストール

1. リポジトリをクローンします。

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. Node の依存関係をインストールします。

   ```bash
   npm install
   ```

3. Codex CLI が利用可能か確認します。

   ```bash
   codex --help
   ```

4. （任意）`vendor/codex` をローカルで使う必要がある場合はサブモジュールを初期化します。

   ```bash
   git submodule update --init --recursive
   ```

補足: `<repository-url>` は実際の Git リモート URL なので、必要に応じて置き換えてください。

## 🛠️ 使い方

### Shell スクリプト: `ls -la` の解析

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

### 🧭 タスク分解スクリプト

大きなタスクを小さく検証可能なステップに分割し、JSON を出力します。

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

タスクファイルを使って出力を保存:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

カスタムスキーマで検証:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### ⚙️ Node TypeScript スクリプト: `ls -la` の解析

（`tsx` 使用）実行:

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

## 🔁 セッションの挙動

`codex exec` は、明示的に再開を指定しない限り、新しい非対話セッションを開始します。前のセッションを続けるには `codex exec resume --last` または `codex exec resume <SESSION_ID>` を使います。セッション ID は、対話型の `codex resume` ピッカー、セッション内の `/status` コマンド、または `~/.codex/sessions/` で確認できます。

これらのスクリプトは `--session-file <path>` でもセッション ID を永続化できます。初回実行時に新規セッションを開始して ID を保存し、以降の実行で再利用します。

`--session-mode` でセッションの挙動を制御します。
- `auto`（既定）: セッションファイルがあれば再開し、なければ新規開始
- `new`: 常に新規セッションを開始（セッションファイルが指定されている場合は上書き）
- `resume`: 既存のセッションを必須化（`--session-file`、`--session`、`--resume-last` のいずれか）

## 🧭 設定

### `scripts/codex_analyze_ls.sh` と `scripts/codex_analyze_ls.ts`

| オプション | 説明 |
|---|---|
| `--resume-last` | 直近の exec セッションを再開 |
| `--session <id>` | 指定した exec セッションを再開 |
| `--session-file <path>` | セッション ID を保存して再利用 |
| `--session-mode <auto|new|resume>` | 明示的なセッション戦略 |
| `--skip-git-check` | Git リポジトリチェックをスキップ |
| `--json` | JSONL イベントを出力 |
| `--output-last-message <path>` | 最終アシスタントメッセージを書き出し |
| `--prompt <text>` | 付与前のカスタムプロンプト接頭辞 |

両方の analyze スクリプトで適用される制約:
- `--resume-last` と `--session` は同時に使えません。
- `--session-file` は `--resume-last` または `--session` と併用できません。
- `--session-mode new` は明示的な再開フラグと同時利用できません。
- `--session-mode resume` は `--session-file`、`--session`、`--resume-last` のいずれかが必要です。

### `scripts/codex_task_breakdown.sh`

| オプション | 説明 |
|---|---|
| `--task <text>` | インラインタスク |
| `--file <path>` | ファイルからタスク本文を読み込む |
| `--schema <path>` | スキーマファイル（既定: `schemas/task_breakdown.schema.json`） |
| `--out <path>` | 最終 JSON をファイル出力 |
| `--skip-git-check` | Git リポジトリチェックをスキップ |

`schemas/task_breakdown.schema.json` のスキーマ:
- 最上位必須: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- 各ステップの必須: `id`, `title`, `goal`, `verification`, `validation`
- 各ステップの任意: `depends_on`

## 📎 使用例

### 実行をまたいでセッションを保存・再利用

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### 最終アシスタントメッセージのみを保存

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

## 📚 ドキュメント

- `docs/idea.md`: Codex ベースのアプリ開発エージェント向けプロダクトビジョン
- `docs/codex-sdk.md`: Codex SDK のインストールと利用メモ

## 🧪 開発メモ

- 両方の analyze スクリプトは `codex` に対して stdin（`-`）経由でプロンプトを送信し、シェルのクォート問題を避けています。
- 両スクリプトとも `Session ID: ...` を `stderr` に出力し、解析可能な `stdout` 出力と混在しないようにしています。
- シェルスクリプトはセッション初期化/保存時の JSONL 解析に `python3`（または `python`）を使用します。
- より高度なプログラム制御（スレッド永続化、再開ワークフロー）が必要な場合は、`docs/codex-sdk.md` の Codex SDK メモを参照してください。
- TypeScript スクリプトの実行は `npx tsx ...` で案内されていますが、`tsx` は現在 `package.json` の直接依存として宣言されていません。

## 🧯 トラブルシューティング

| 症状 | 想定原因 | 解決方法 |
|---|---|---|
| `codex CLI not found in PATH` | `codex` が未インストールまたは検出不可 | Codex CLI をインストールし、`codex --help` で確認してください。 |
| `Not inside a Git repo` | スクリプトのガードで実行がブロックされた | リポジトリ内で実行するか `--skip-git-check` を付けてください。 |
| `Session file is empty or missing` with `--session-mode resume` | `resume` モードには既存 ID ソースが必要 | 先にセッションファイルを作成しておきます（例: `--session-mode auto` または `--session-mode new`）。 |
| `python3 or python is required` | JSON 解析のためシェルスクリプト実行で Python が必要 | Python をインストールして再実行してください。 |
| `npx tsx` issues | ローカルで実行依存が不足 | `npx tsx ...` を直接実行するか、`tsx` を dev dependency として追加してください。 |

## 🗺️ ロードマップ

- `i18n/` 配下に多言語 README を生成し、言語リンクを同期して保守する。
- よく使うフロー向けの npm スクリプトエイリアスを追加する（`analyze:sh`、`analyze:ts`、`plan:task`）。
- シェルスクリプト lint とスキーマ検証を行う軽量 CI チェックを追加する。
- `docs/` に実践的なタスクプランテンプレートを追加して拡充する。

## 🤝 コントリビューション

コントリビューションは歓迎します。

推奨ワークフロー:
1. フィーチャーブランチを作成する。
2. 変更は目的を絞り、リポジトリの実態に沿う形にする。
3. CLI の挙動変更があればドキュメントや例を更新する。
4. 挙動変更と検証手順を説明した pull request を作成する。

## ライセンス

`package.json` のメタデータにはライセンスとして `ISC` が記載されています。

注: このチェックアウト時点では、スタンドアロンの `LICENSE` ファイルは存在しませんでした。


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
