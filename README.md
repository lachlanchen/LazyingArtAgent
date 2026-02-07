# Codex Exec Helpers

These scripts run `ls -la`, then ask Codex to analyze the listing.

## Session behavior

`codex exec` starts a new non-interactive session unless you explicitly resume one. To continue a prior session, use `codex exec resume --last` or `codex exec resume <SESSION_ID>`. You can find session IDs via the interactive `codex resume` picker, the `/status` command inside a session, or in `~/.codex/sessions/`.

These scripts also support `--session-file <path>` to persist the session ID. On first run, they start a new session, save the ID, then reuse it on subsequent runs.

You can control session behavior with `--session-mode`:
- `auto` (default): resume if a session file exists, otherwise start a new session
- `new`: always start a new session (overwrites the session file if provided)
- `resume`: require an existing session (from `--session-file`, `--session`, or `--resume-last`)

## Prereqs

- `codex` CLI available in `PATH`
- Run inside a Git repo, or pass `--skip-git-check`

## Shell script

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

## Task breakdown script

Split a large task into small, verifiable steps and output JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Use a task file and save output:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

## Node TypeScript script

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

## Docs

- `docs/idea.md`: product vision for the Codex-powered app development agent
- `docs/codex-sdk.md`: Codex SDK install and usage notes

## Notes

- Both scripts send the prompt to `codex` via stdin (`-`), which avoids shell-quoting issues.
- Both scripts print `Session ID: ...` to stderr so it doesn't interfere with stdout.
- The shell script uses `python3` (or `python`) to parse JSONL when initializing a session file.
- For deeper programmatic control (threads, resumable workflows), consider the Codex SDK and store the thread ID between runs.
# LazyingArtAgent
