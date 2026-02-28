[English](README.md) · [العربية](i18n/README.ar.md) · [Español](i18n/README.es.md) · [Français](i18n/README.fr.md) · [日本語](i18n/README.ja.md) · [한국어](i18n/README.ko.md) · [Tiếng Việt](i18n/README.vi.md) · [中文 (简体)](i18n/README.zh-Hans.md) · [中文（繁體）](i18n/README.zh-Hant.md) · [Deutsch](i18n/README.de.md) · [Русский](i18n/README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> These scripts run `ls -la`, then ask Codex to analyze the listing.

## Overview

This repository provides practical CLI helpers for Codex-driven workflows:
- Analyze the current directory listing with Codex using either Bash or TypeScript.
- Persist and resume Codex exec sessions across runs.
- Break large tasks into small, verifiable JSON steps enforced by a schema.

The repository also contains early product vision and SDK notes for a broader Codex-powered development agent.

### At a Glance

| Area | What you get |
|---|---|
| 🔁 Session continuity | Resume last session, explicit session IDs, or persistent session files |
| 📤 Output handling | JSONL stream mode and final-message export |
| 🧩 Structured planning | JSON schema-constrained task breakdown workflow |
| 🛠️ Dual implementation | Shell and TypeScript entrypoints for listing analysis |
| 📚 Project notes | Product vision + Codex SDK notes in `docs/` |

## Features

- Session-aware Codex execution:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Output control:
  - `--json` event stream passthrough
  - `--output-last-message <path>`
  - `--prompt <text>` custom prompt prefix
- Task planner script with schema enforcement:
  - `--task` or `--file`
  - `--schema` override
  - `--out` output file
- Both shell and TypeScript entrypoints for listing analysis.

## Project Structure

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

## Session Behavior

`codex exec` starts a new non-interactive session unless you explicitly resume one. To continue a prior session, use `codex exec resume --last` or `codex exec resume <SESSION_ID>`. You can find session IDs via the interactive `codex resume` picker, the `/status` command inside a session, or in `~/.codex/sessions/`.

These scripts also support `--session-file <path>` to persist the session ID. On first run, they start a new session, save the ID, then reuse it on subsequent runs.

You can control session behavior with `--session-mode`:
- `auto` (default): resume if a session file exists, otherwise start a new session
- `new`: always start a new session (overwrites the session file if provided)
- `resume`: require an existing session (from `--session-file`, `--session`, or `--resume-last`)

## Prerequisites

| Requirement | Why it is needed |
|---|---|
| `codex` CLI in `PATH` | Required by all helper scripts |
| Git repository context (or `--skip-git-check`) | Scripts guard against accidental non-repo execution |
| `python3` (or `python`) for `scripts/codex_analyze_ls.sh` | Needed for JSON parsing when initializing/capturing session output |
| Node.js 18+ for `scripts/codex_analyze_ls.ts` | Recommended runtime for the TypeScript entrypoint |

## Installation

1. Clone the repository.
2. Install Node dependencies:

```bash
npm install
```

3. Ensure `codex` CLI is installed and available:

```bash
codex --help
```

4. Optional: initialize submodules if you want local access to `vendor/codex`:

```bash
git submodule update --init --recursive
```

Note: `.gitmodules` declares `vendor/codex`, but it may be uninitialized in some checkouts.

## Usage

### Shell Script: Analyze `ls -la`

Run:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

Other examples:

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

Split a large task into small, verifiable steps and output JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Use a task file and save output:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Validate with a custom schema path:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Node TypeScript Script: Analyze `ls -la`

Run (with `tsx`):

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

Other examples:

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

## Configuration

### `scripts/codex_analyze_ls.sh` and `scripts/codex_analyze_ls.ts`

| Option | Description |
|---|---|
| `--resume-last` | Resume the most recent exec session |
| `--session <id>` | Resume a specific exec session |
| `--session-file <path>` | Persist and reuse a session ID |
| `--session-mode <auto|new|resume>` | Explicit session strategy |
| `--skip-git-check` | Bypass Git repository check |
| `--json` | Emit JSONL events |
| `--output-last-message <path>` | Write final assistant message |
| `--prompt <text>` | Custom prompt prefix before appended listing |

Constraint rules enforced by both analyze scripts:
- `--resume-last` and `--session` are mutually exclusive.
- `--session-file` cannot be combined with `--resume-last` or `--session`.
- `--session-mode new` cannot be combined with explicit resume flags.
- `--session-mode resume` requires `--session-file`, `--session`, or `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Option | Description |
|---|---|
| `--task <text>` | Inline task |
| `--file <path>` | Task text from file |
| `--schema <path>` | Schema file (default: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Write final JSON to file |
| `--skip-git-check` | Bypass Git repository check |

Schema shape (`schemas/task_breakdown.schema.json`):
- Top-level required: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Per-step required: `id`, `title`, `goal`, `verification`, `validation`
- Optional per-step: `depends_on`

## Examples

### Persist and reuse a session across runs

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Save only the final assistant message

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Generate a task plan JSON artifact

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## Docs

- `docs/idea.md`: product vision for the Codex-powered app development agent
- `docs/codex-sdk.md`: Codex SDK install and usage notes

## Development Notes

- Both analyze scripts send the prompt to `codex` via stdin (`-`), which avoids shell-quoting issues.
- Both scripts print `Session ID: ...` to stderr so it doesn't interfere with stdout.
- The shell script uses `python3` (or `python`) to parse JSONL when initializing a session file.
- For deeper programmatic control (threads, resumable workflows), consider the Codex SDK and store the thread ID between runs.
- `npx tsx ...` is documented for running the TypeScript script; `tsx` is not currently declared in `package.json` (install it globally or run via `npx`).

## Troubleshooting

| Symptom | Likely cause | Resolution |
|---|---|---|
| `codex CLI not found in PATH` | Codex CLI is not installed or not discoverable | Install the Codex CLI and verify with `codex --help`. |
| `Not inside a Git repo` | Script guard blocked execution | Run inside a repository or pass `--skip-git-check`. |
| `Session file is empty or missing` with `--session-mode resume` | Resume mode requires an existing ID source | Create/seed the session file first (for example with `--session-mode auto` or `--session-mode new`). |
| `python3 or python is required` (shell script path) | Python missing for JSONL parsing | Install Python and retry. |
| `npx tsx` issues | Runtime dependency not available locally | Use `npx tsx ...` directly, or add `tsx` as a dev dependency locally. |

## Roadmap

- Add generated multilingual README files under `i18n/` and keep language navigation synchronized.
- Add npm script aliases for common flows (`analyze:sh`, `analyze:ts`, `plan:task`).
- Add lightweight CI checks for shell script linting and schema validation examples.
- Expand task planner examples with real-world templates in `docs/`.

## Contributing

Contributions are welcome.

Suggested workflow:
1. Create a feature branch.
2. Keep changes focused and repository-accurate.
3. Update docs/examples when CLI behavior changes.
4. Open a pull request describing behavior changes and validation steps.

## License

Package metadata declares license `ISC` in `package.json`.

Note: a standalone `LICENSE` file was not present in this checkout at the time of writing.
