[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> 이 스크립트들은 `ls -la`를 실행한 뒤, 해당 목록을 Codex가 분석하도록 요청합니다.

## 개요

이 저장소는 Codex 기반 워크플로를 위한 실용적인 CLI 헬퍼를 제공합니다:
- Bash 또는 TypeScript를 사용해 현재 디렉터리 목록을 Codex로 분석
- 실행 간 Codex exec 세션을 저장하고 재개
- 스키마로 강제되는 작은 단위의 검증 가능한 JSON 단계로 큰 작업 분해

이 저장소에는 더 넓은 Codex 기반 개발 에이전트를 위한 초기 제품 비전과 SDK 노트도 포함되어 있습니다.

### 한눈에 보기

| 영역 | 제공 내용 |
|---|---|
| 🔁 세션 연속성 | 마지막 세션 재개, 명시적 세션 ID, 영속 세션 파일 |
| 📤 출력 처리 | JSONL 스트림 모드와 최종 메시지 내보내기 |
| 🧩 구조화된 계획 | JSON 스키마 제약 기반 작업 분해 워크플로 |
| 🛠️ 이중 구현 | 목록 분석을 위한 Shell/TypeScript 진입점 |
| 📚 프로젝트 노트 | `docs/`의 제품 비전 + Codex SDK 노트 |

## 기능

- 세션 인식 Codex 실행:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- 출력 제어:
  - `--json` 이벤트 스트림 패스스루
  - `--output-last-message <path>`
  - `--prompt <text>` 사용자 정의 프롬프트 접두사
- 스키마 강제가 적용된 작업 플래너 스크립트:
  - `--task` 또는 `--file`
  - `--schema` 재정의
  - `--out` 출력 파일
- 목록 분석을 위한 Shell/TypeScript 진입점 모두 제공

## 프로젝트 구조

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

## 세션 동작

`codex exec`는 명시적으로 재개하지 않으면 새 비대화형 세션을 시작합니다. 이전 세션을 이어가려면 `codex exec resume --last` 또는 `codex exec resume <SESSION_ID>`를 사용하세요. 세션 ID는 대화형 `codex resume` 선택기, 세션 내부의 `/status` 명령, 또는 `~/.codex/sessions/`에서 확인할 수 있습니다.

이 스크립트들은 `--session-file <path>`도 지원하여 세션 ID를 영속화합니다. 첫 실행에서는 새 세션을 시작해 ID를 저장하고, 이후 실행에서는 재사용합니다.

`--session-mode`로 세션 동작을 제어할 수 있습니다:
- `auto` (기본값): 세션 파일이 있으면 재개, 없으면 새 세션 시작
- `new`: 항상 새 세션 시작 (`--session-file` 제공 시 파일 덮어씀)
- `resume`: 기존 세션 필요 (`--session-file`, `--session`, 또는 `--resume-last`에서 가져옴)

## 사전 요구사항

| 요구사항 | 필요한 이유 |
|---|---|
| `PATH` 내 `codex` CLI | 모든 헬퍼 스크립트에 필요 |
| Git 저장소 컨텍스트 (또는 `--skip-git-check`) | 스크립트가 실수로 비저장소에서 실행되는 것을 방지 |
| `scripts/codex_analyze_ls.sh`용 `python3` (또는 `python`) | 세션 출력 초기화/캡처 시 JSON 파싱에 필요 |
| `scripts/codex_analyze_ls.ts`용 Node.js 18+ | TypeScript 진입점 권장 런타임 |

## 설치

1. 저장소를 클론합니다.
2. Node 의존성을 설치합니다:

```bash
npm install
```

3. `codex` CLI가 설치되어 있고 사용 가능한지 확인합니다:

```bash
codex --help
```

4. 선택 사항: `vendor/codex`에 로컬로 접근하려면 서브모듈을 초기화합니다:

```bash
git submodule update --init --recursive
```

참고: `.gitmodules`에는 `vendor/codex`가 선언되어 있지만, 일부 체크아웃에서는 초기화되지 않았을 수 있습니다.

## 사용법

### Shell 스크립트: `ls -la` 분석

실행:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

다른 예시:

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

### 작업 분해 스크립트

큰 작업을 작고 검증 가능한 단계로 분해하고 JSON을 출력합니다:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

작업 파일을 사용하고 출력을 저장:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

사용자 정의 스키마 경로로 검증:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Node TypeScript 스크립트: `ls -la` 분석

실행 (`tsx` 사용):

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

다른 예시:

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

## 설정

### `scripts/codex_analyze_ls.sh` 및 `scripts/codex_analyze_ls.ts`

| 옵션 | 설명 |
|---|---|
| `--resume-last` | 가장 최근 exec 세션 재개 |
| `--session <id>` | 특정 exec 세션 재개 |
| `--session-file <path>` | 세션 ID 저장 및 재사용 |
| `--session-mode <auto|new|resume>` | 명시적 세션 전략 |
| `--skip-git-check` | Git 저장소 검사 우회 |
| `--json` | JSONL 이벤트 출력 |
| `--output-last-message <path>` | 최종 어시스턴트 메시지 기록 |
| `--prompt <text>` | 목록을 덧붙이기 전 사용자 정의 프롬프트 접두사 |

두 분석 스크립트에서 강제하는 제약 규칙:
- `--resume-last`와 `--session`은 동시에 사용할 수 없습니다.
- `--session-file`은 `--resume-last` 또는 `--session`과 함께 사용할 수 없습니다.
- `--session-mode new`는 명시적 재개 플래그와 함께 사용할 수 없습니다.
- `--session-mode resume`는 `--session-file`, `--session`, 또는 `--resume-last`가 필요합니다.

### `scripts/codex_task_breakdown.sh`

| 옵션 | 설명 |
|---|---|
| `--task <text>` | 인라인 작업 |
| `--file <path>` | 파일에서 작업 텍스트 읽기 |
| `--schema <path>` | 스키마 파일 (기본값: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | 최종 JSON을 파일로 기록 |
| `--skip-git-check` | Git 저장소 검사 우회 |

스키마 형태 (`schemas/task_breakdown.schema.json`):
- 최상위 필수: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- 단계별 필수: `id`, `title`, `goal`, `verification`, `validation`
- 단계별 선택: `depends_on`

## 예시

### 실행 간 세션 저장 및 재사용

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### 최종 어시스턴트 메시지만 저장

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### 작업 계획 JSON 산출물 생성

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 문서

- `docs/idea.md`: Codex 기반 앱 개발 에이전트를 위한 제품 비전
- `docs/codex-sdk.md`: Codex SDK 설치 및 사용 노트

## 개발 노트

- 두 분석 스크립트 모두 프롬프트를 stdin(`-`)을 통해 `codex`에 전달하여 셸 인용(quoting) 문제를 피합니다.
- 두 스크립트 모두 stdout 간섭을 막기 위해 stderr에 `Session ID: ...`를 출력합니다.
- 셸 스크립트는 세션 파일 초기화 시 JSONL 파싱을 위해 `python3` (또는 `python`)를 사용합니다.
- 더 깊은 수준의 프로그래매틱 제어(스레드, 재개 가능한 워크플로)가 필요하면 Codex SDK를 고려하고 실행 간 스레드 ID를 저장하세요.
- TypeScript 스크립트 실행은 `npx tsx ...` 기준으로 문서화되어 있으며, 현재 `package.json`에는 `tsx`가 선언되어 있지 않습니다(전역 설치 또는 `npx` 사용).

## 문제 해결

| 증상 | 가능한 원인 | 해결 방법 |
|---|---|---|
| `codex CLI not found in PATH` | Codex CLI가 설치되지 않았거나 탐지되지 않음 | Codex CLI를 설치하고 `codex --help`로 확인하세요. |
| `Not inside a Git repo` | 스크립트 가드가 실행을 차단함 | 저장소 내부에서 실행하거나 `--skip-git-check`를 전달하세요. |
| `--session-mode resume` 사용 시 `Session file is empty or missing` | 재개 모드에는 기존 ID 소스가 필요함 | 먼저 세션 파일을 만들거나 채우세요(예: `--session-mode auto` 또는 `--session-mode new`). |
| `(shell script path) python3 or python is required` | JSONL 파싱용 Python 누락 | Python을 설치한 뒤 다시 시도하세요. |
| `npx tsx` 관련 문제 | 로컬 런타임 의존성 없음 | `npx tsx ...`를 직접 사용하거나 `tsx`를 로컬 dev dependency로 추가하세요. |

## 로드맵

- `i18n/`에 생성된 다국어 README 파일을 추가하고 언어 네비게이션을 동기화 유지.
- 공통 흐름용 npm 스크립트 별칭 추가(`analyze:sh`, `analyze:ts`, `plan:task`).
- 셸 스크립트 린트와 스키마 검증 예시를 위한 경량 CI 검사 추가.
- `docs/`의 실제 템플릿으로 작업 플래너 예시 확장.

## 기여

기여를 환영합니다.

권장 워크플로:
1. 기능 브랜치를 생성합니다.
2. 변경 사항은 집중도 높게 유지하고 저장소 실제 상태와 일치시키세요.
3. CLI 동작이 바뀌면 문서/예시를 업데이트하세요.
4. 동작 변경점과 검증 단계를 설명하는 Pull Request를 엽니다.

## 라이선스

패키지 메타데이터에는 `package.json` 기준으로 `ISC` 라이선스가 선언되어 있습니다.

참고: 작성 시점 체크아웃에는 독립적인 `LICENSE` 파일이 존재하지 않았습니다.
