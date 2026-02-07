#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: codex_task_breakdown.sh [options]

Ask Codex to split a task into small, verifiable steps and output JSON.

Options:
  --task <text>               Task description (inline)
  --file <path>               Task description from a file
  --schema <path>             JSON schema to enforce (default: schemas/task_breakdown.schema.json)
  --out <path>                Write final JSON to a file
  --skip-git-check            Allow running outside a Git repo
  -h, --help                  Show help

Notes:
- If neither --task nor --file is provided, the task is read from stdin.
USAGE
}

task_text=""
task_file=""
schema_path="schemas/task_breakdown.schema.json"
out_file=""
skip_git_check=0

while [ $# -gt 0 ]; do
  case "$1" in
    --task)
      task_text="${2:-}"
      shift
      ;;
    --file)
      task_file="${2:-}"
      shift
      ;;
    --schema)
      schema_path="${2:-}"
      shift
      ;;
    --out)
      out_file="${2:-}"
      shift
      ;;
    --skip-git-check)
      skip_git_check=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

if ! command -v codex >/dev/null 2>&1; then
  echo "codex CLI not found in PATH. Install it first." >&2
  exit 1
fi

if [ "$skip_git_check" -eq 0 ]; then
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Not inside a Git repo. Re-run with --skip-git-check if this is intentional." >&2
    exit 1
  fi
fi

if [ -n "$task_text" ] && [ -n "$task_file" ]; then
  echo "Choose only one of --task or --file." >&2
  exit 1
fi

if [ -n "$task_file" ]; then
  if [ ! -f "$task_file" ]; then
    echo "Task file not found: $task_file" >&2
    exit 1
  fi
  task_text=$(cat "$task_file")
fi

if [ -z "$task_text" ]; then
  if [ -t 0 ]; then
    echo "Provide --task, --file, or pipe task text on stdin." >&2
    usage >&2
    exit 1
  fi
  task_text=$(cat)
fi

if [ ! -f "$schema_path" ]; then
  echo "Schema not found: $schema_path" >&2
  exit 1
fi

prompt=$'You are an engineering planner. Break down the task into small, sequential steps that are easy to verify and validate.\n\nReturn JSON that strictly conforms to the provided schema.\n\nGuidelines:\n- Keep steps small and testable (1-2 hours each where possible).\n- Provide concrete verification checks (commands, tests, or observable outputs).\n- Provide validation criteria that confirm the step meets the user intent.\n- Prefer explicit dependencies via depends_on if needed.\n- Avoid implementation details that require access to external secrets.\n\nTask:\n'"$task_text"

cmd=(codex exec --output-schema "$schema_path")
if [ -n "$out_file" ]; then
  out_dir=$(dirname "$out_file")
  if [ -n "$out_dir" ] && [ "$out_dir" != "." ]; then
    mkdir -p "$out_dir"
  fi
  cmd+=(-o "$out_file")
fi
if [ "$skip_git_check" -eq 1 ]; then
  cmd+=(--skip-git-repo-check)
fi
cmd+=(-)

printf "%s" "$prompt" | "${cmd[@]}"
