[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://github.com/lachlanchen/LazyingArtWebsite/raw/main/media/brand/lazyingart-intro.gif)](https://lazying.art)

# 🧠 Codex 실행 도우미 (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 Focus | 🧰 Details |
|---|---|
| 세션 지속성 | 실행 간 Codex 세션을 재개하고 유지 |
| 출력 품질 | JSONL 이벤트 패스스루 + 최종 메시지 내보내기 |
| 계획 지원 | 스키마 기반 작업 분해 생성 |
| 실행 환경 | 로컬 셸 및 CI 친화적 워크플로우 |

> Codex 워크플로우에서 세션 컨텍스트를 유지하고 구조화된 출력을 보장하는 실용적인 CLI 도우미입니다.

## 🎯 개요

이 저장소는 Codex 기반 워크플로우를 위한 가볍지만 실무적인 명령줄 도구를 제공합니다.

- 현재 디렉터리 목록을 Codex로 분석합니다.
- 실행 간에 Codex 세션을 이어서 계속할 수 있습니다.
- 대형 작업을 스키마 제약이 있는 검증 가능한 단계로 분해합니다.
- Codex 워크플로우 아이디어가 진화할 때 사용 지침과 SDK 노트를 함께 유지합니다.

이 도구는 `codex` 및 필수 런타임 도구를 사용할 수 있는 모든 환경에서 실행할 수 있도록 가볍고 스크립트 우선 방식으로 설계했습니다.

## 🚀 빠른 핵심 기능

### 한눈에 보기

| 영역 | 제공 내용 |
|---|---|
| 🔁 세션 지속성 | 최근 세션 복원, 명시적 세션 ID, 또는 지속 세션 파일 |
| 📤 출력 처리 | JSONL 이벤트 스트리밍 및 최종 메시지 출력 |
| 🧩 구조화된 계획 | JSON 스키마 제약 기반 작업 분할 출력 |
| 🛠️ 이중 엔트리포인트 | Bash와 TypeScript 구현 |
| 📚 내장 컨텍스트 | `docs/`에 정리된 프로젝트 가이드 |

### 🧩 기능

- 세션 인지형 Codex 실행:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- 출력 제어:
  - `--json` 이벤트 스트림 패스스루
  - `--output-last-message <path>`
  - `--prompt <text>` 사용자 정의 프롬프트 접두사
- 스키마 강제 작업 계획 스크립트:
  - `--task` 또는 `--file`
  - `--schema` 오버라이드
  - `--out` 출력 파일
- 목록 분석을 위한 셸 및 TypeScript 진입점 모두 제공.

## 🧱 프로젝트 구조

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

## ✅ 사전 요구사항

| 필요 항목 | 이유 |
|---|---|
| `PATH` 내 `codex` CLI | 모든 도우미 스크립트에서 필수 |
| Git 저장소 컨텍스트(또는 `--skip-git-check`) | 스크립트가 실수로 Git 저장소가 아닌 환경에서 실행되는 것을 방지 |
| `python3` (또는 `python`) `scripts/codex_analyze_ls.sh`용 | 초기화/세션 출력 저장 시 JSON 파싱에 필요 |
| Node.js 18+ `scripts/codex_analyze_ls.ts`용 | TypeScript 진입점 실행을 위한 런타임 |

## 🔧 설치

1. 저장소를 클론합니다.

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. Node 의존성을 설치합니다.

   ```bash
   npm install
   ```

3. Codex CLI가 사용 가능한지 확인합니다.

   ```bash
   codex --help
   ```

4. (선택) `vendor/codex`를 로컬에서 사용할 필요가 있으면 서브모듈을 초기화합니다.

   ```bash
   git submodule update --init --recursive
   ```

가정: `<repository-url>`는 사용 중인 Git 원격 URL입니다. 실제 origin 주소로 변경하세요.

## 🛠️ 사용법

### 쉘 스크립트: `ls -la` 분석

실행:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

기타 예시:

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

### 🧭 작업 분해 스크립트

큰 작업을 작고 검증 가능한 단계로 분해하고 JSON을 출력하세요:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

작업 파일을 사용해 결과를 저장하려면:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

커스텀 스키마 경로로 유효성 검사:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### ⚙️ Node TypeScript 스크립트: `ls -la` 분석

`tsx`를 사용해 실행:

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

기타 예시:

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

## 🔁 세션 동작

`codex exec`은 명시적으로 재개를 요청하지 않으면 새 비대화형 세션을 시작합니다. 이전 세션을 이어가려면 `codex exec resume --last` 또는 `codex exec resume <SESSION_ID>`를 사용합니다. 세션 ID는 대화형 `codex resume` 선택기, 세션 내 `/status` 명령, 또는 `~/.codex/sessions/`에서 확인할 수 있습니다.

이 스크립트는 또한 `--session-file <path>`를 지원하여 세션 ID를 지속 저장합니다. 첫 실행에서는 새 세션을 시작해 ID를 저장하고, 다음 실행에서는 이를 재사용합니다.

`--session-mode`로 세션 동작을 제어할 수 있습니다.
- `auto` (기본값): 세션 파일이 있으면 이어서 사용, 없으면 새 세션 시작
- `new`: 항상 새 세션 생성(`--session-file`이 있으면 덮어씀)
- `resume`: 기존 세션이 있어야 함(`--session-file`, `--session`, 또는 `--resume-last`)

## 🧭 설정

### `scripts/codex_analyze_ls.sh` 및 `scripts/codex_analyze_ls.ts`

| 옵션 | 설명 |
|---|---|
| `--resume-last` | 가장 최근 exec 세션을 재개 |
| `--session <id>` | 지정한 exec 세션을 재개 |
| `--session-file <path>` | 세션 ID를 저장하고 재사용 |
| `--session-mode <auto|new|resume>` | 세션 동작 전략을 명시적으로 지정 |
| `--skip-git-check` | Git 저장소 확인을 건너뜀 |
| `--json` | JSONL 이벤트를 출력 |
| `--output-last-message <path>` | 최종 어시스턴트 메시지를 기록 |
| `--prompt <text>` | 추가될 목록 앞에 붙일 사용자 정의 프롬프트 접두사 |

두 분석 스크립트에서 적용되는 제약 규칙:
- `--resume-last`와 `--session`은 동시에 사용할 수 없습니다.
- `--session-file`은 `--resume-last` 또는 `--session`과 조합할 수 없습니다.
- `--session-mode new`는 명시적 재개 플래그와 함께 사용할 수 없습니다.
- `--session-mode resume`는 `--session-file`, `--session`, 또는 `--resume-last`가 필요합니다.

### `scripts/codex_task_breakdown.sh`

| 옵션 | 설명 |
|---|---|
| `--task <text>` | 인라인 작업 |
| `--file <path>` | 파일에서 작업 텍스트 읽기 |
| `--schema <path>` | 스키마 파일(기본값: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | 최종 JSON을 파일로 출력 |
| `--skip-git-check` | Git 저장소 확인을 건너뜀 |

스키마 구조 (`schemas/task_breakdown.schema.json`):
- 최상위 필수 항목: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- 단계별 필수 항목: `id`, `title`, `goal`, `verification`, `validation`
- 단계별 선택 항목: `depends_on`

## 📎 예시

### 실행 간 세션 유지 및 재사용

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

## 📚 문서

- `docs/idea.md`: Codex 기반 앱 개발 에이전트를 위한 제품 비전
- `docs/codex-sdk.md`: Codex SDK 설치 및 사용 노트

## 🧪 개발 노트

- 두 분석 스크립트는 셸 인용 처리 가장자리 사례를 피하기 위해 `codex`에 프롬프트를 stdin(`-`)으로 전달합니다.
- 두 스크립트 모두 파싱 가능한 `stdout` 출력에 영향을 주지 않도록 `Session ID: ...`를 `stderr`로 출력합니다.
- 셸 스크립트는 세션 상태 초기화/저장 시 JSONL 파싱을 위해 `python3`(또는 `python`)을 사용합니다.
- 더 깊은 프로그램 제어(스레드 지속성, resume 워크플로우)가 필요하면 `docs/codex-sdk.md`의 Codex SDK 노트를 참조하세요.
- `npx tsx ...`는 TypeScript 스크립트 실행에 대해 문서화되어 있으며, 현재 `tsx`는 `package.json`에 직접 의존성으로 선언되어 있지 않습니다.

## 🧯 문제 해결

| 증상 | 가능한 원인 | 해결 방법 |
|---|---|---|
| `codex CLI not found in PATH` | `codex`가 설치되지 않았거나 찾을 수 없음 | Codex CLI를 설치하고 `codex --help`로 확인 |
| `Not inside a Git repo` | 스크립트 보호 장치가 실행을 차단 | 저장소 내부에서 실행하거나 `--skip-git-check`를 전달 |
| `Session file is empty or missing` with `--session-mode resume` | Resume 모드에 기존 ID 출처가 없음 | 먼저 세션 파일을 생성/준비(예: `--session-mode auto` 또는 `--session-mode new` 사용) |
| `python3 or python is required` | 셸 스크립트가 Python 파싱에 의존함 | Python을 설치한 뒤 재시도 |
| `npx tsx` issues | 로컬 런타임 의존성 누락 | `npx tsx ...`를 직접 실행하거나 `tsx`를 개발 의존성으로 추가 |

## 🗺️ 로드맵

- `i18n/` 아래에 생성된 다국어 README를 추가하고 언어 내비게이션을 동기화 유지
- 공통 실행 흐름용 npm 스크립트 별칭 추가 (`analyze:sh`, `analyze:ts`, `plan:task`)
- 셸 스크립트 린트와 스키마 유효성 검사를 위한 가벼운 CI 체크 추가
- `docs/`의 실무 템플릿으로 작업 계획 예시를 확장

## 🤝 기여

기여를 환영합니다.

권장 작업 흐름:
1. 기능 브랜치를 만드세요.
2. 변경 범위를 좁고 저장소 실제 동작과 일치하게 유지하세요.
3. CLI 동작이 바뀌면 문서/예시를 함께 업데이트하세요.
4. 동작 변경과 검증 단계를 설명하는 PR을 작성하세요.

## 라이선스

`package.json`의 패키지 메타데이터는 라이선스를 `ISC`로 선언합니다.

참고: 이 체크아웃 기준으로는 독립 `LICENSE` 파일이 존재하지 않습니다.


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
