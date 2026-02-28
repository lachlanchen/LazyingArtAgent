[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> Эти скрипты выполняют `ls -la`, а затем просят Codex проанализировать вывод.

## Обзор

Этот репозиторий предоставляет практичные CLI-хелперы для рабочих процессов на базе Codex:
- Анализ текущего списка файлов в директории через Codex с использованием Bash или TypeScript.
- Сохранение и возобновление сессий Codex exec между запусками.
- Разбиение больших задач на небольшие проверяемые JSON-шаги с принудительной валидацией по схеме.

Репозиторий также содержит раннее видение продукта и заметки по SDK для более широкого агента разработки на базе Codex.

### Кратко

| Область | Что вы получаете |
|---|---|
| 🔁 Непрерывность сессий | Возобновление последней сессии, явные ID сессий или постоянные файлы сессии |
| 📤 Работа с выводом | Потоковый режим JSONL и экспорт финального сообщения |
| 🧩 Структурированное планирование | Workflow разбиения задач с ограничением JSON Schema |
| 🛠️ Две реализации | Shell- и TypeScript-энтрипоинты для анализа списка файлов |
| 📚 Заметки по проекту | Видение продукта + заметки по Codex SDK в `docs/` |

## Возможности

- Выполнение Codex с учётом сессий:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Управление выводом:
  - `--json` сквозная передача потока событий
  - `--output-last-message <path>`
  - `--prompt <text>` пользовательский префикс промпта
- Скрипт планирования задач с валидацией схемы:
  - `--task` или `--file`
  - `--schema` переопределение схемы
  - `--out` выходной файл
- Для анализа списка файлов доступны энтрипоинты и для shell, и для TypeScript.

## Структура проекта

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

## Поведение сессий

`codex exec` запускает новую неинтерактивную сессию, если вы явно не запросили возобновление. Чтобы продолжить предыдущую сессию, используйте `codex exec resume --last` или `codex exec resume <SESSION_ID>`. Найти ID сессий можно через интерактивный выбор `codex resume`, команду `/status` внутри сессии или в `~/.codex/sessions/`.

Эти скрипты также поддерживают `--session-file <path>` для сохранения ID сессии. При первом запуске создаётся новая сессия, ID сохраняется, а при последующих запусках используется повторно.

Вы можете управлять поведением сессий через `--session-mode`:
- `auto` (по умолчанию): возобновлять сессию, если файл сессии существует, иначе запускать новую
- `new`: всегда запускать новую сессию (перезаписывает файл сессии, если он указан)
- `resume`: требовать существующую сессию (из `--session-file`, `--session` или `--resume-last`)

## Требования

| Требование | Зачем нужно |
|---|---|
| `codex` CLI в `PATH` | Обязателен для всех вспомогательных скриптов |
| Контекст Git-репозитория (или `--skip-git-check`) | Скрипты защищают от случайного запуска вне репозитория |
| `python3` (или `python`) для `scripts/codex_analyze_ls.sh` | Нужен для разбора JSON при инициализации/сохранении вывода сессии |
| Node.js 18+ для `scripts/codex_analyze_ls.ts` | Рекомендуемая среда выполнения для TypeScript-энтрипоинта |

## Установка

1. Клонируйте репозиторий.
2. Установите зависимости Node:

```bash
npm install
```

3. Убедитесь, что CLI `codex` установлен и доступен:

```bash
codex --help
```

4. Необязательно: инициализируйте сабмодули, если хотите иметь локальный доступ к `vendor/codex`:

```bash
git submodule update --init --recursive
```

Примечание: в `.gitmodules` объявлен `vendor/codex`, но в некоторых checkout он может быть неинициализирован.

## Использование

### Shell-скрипт: анализ `ls -la`

Запуск:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

Другие примеры:

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

### Скрипт разбиения задач

Разбейте большую задачу на небольшие проверяемые шаги и получите JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Использование файла задачи и сохранение результата:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Проверка с пользовательским путём к схеме:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Node TypeScript-скрипт: анализ `ls -la`

Запуск (с `tsx`):

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

Другие примеры:

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

## Конфигурация

### `scripts/codex_analyze_ls.sh` и `scripts/codex_analyze_ls.ts`

| Опция | Описание |
|---|---|
| `--resume-last` | Возобновить самую недавнюю exec-сессию |
| `--session <id>` | Возобновить конкретную exec-сессию |
| `--session-file <path>` | Сохранить и повторно использовать ID сессии |
| `--session-mode <auto|new|resume>` | Явная стратегия работы с сессией |
| `--skip-git-check` | Обойти проверку Git-репозитория |
| `--json` | Выводить события JSONL |
| `--output-last-message <path>` | Записать итоговое сообщение ассистента |
| `--prompt <text>` | Пользовательский префикс промпта перед добавленным списком |

Правила ограничений, которые применяют оба скрипта анализа:
- `--resume-last` и `--session` взаимоисключающие.
- `--session-file` нельзя комбинировать с `--resume-last` или `--session`.
- `--session-mode new` нельзя комбинировать с явными флагами возобновления.
- `--session-mode resume` требует `--session-file`, `--session` или `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Опция | Описание |
|---|---|
| `--task <text>` | Встроенный текст задачи |
| `--file <path>` | Текст задачи из файла |
| `--schema <path>` | Файл схемы (по умолчанию: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Записать итоговый JSON в файл |
| `--skip-git-check` | Обойти проверку Git-репозитория |

Форма схемы (`schemas/task_breakdown.schema.json`):
- Обязательные верхнего уровня: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Обязательные для каждого шага: `id`, `title`, `goal`, `verification`, `validation`
- Необязательное для шага: `depends_on`

## Примеры

### Сохранение и повторное использование сессии между запусками

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Сохранить только финальное сообщение ассистента

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Сгенерировать JSON-артефакт плана задачи

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## Документация

- `docs/idea.md`: видение продукта для агента разработки приложений на базе Codex
- `docs/codex-sdk.md`: заметки по установке и использованию Codex SDK

## Примечания по разработке

- Оба скрипта анализа отправляют промпт в `codex` через stdin (`-`), что помогает избежать проблем с экранированием в shell.
- Оба скрипта печатают `Session ID: ...` в stderr, чтобы не мешать stdout.
- Shell-скрипт использует `python3` (или `python`) для разбора JSONL при инициализации файла сессии.
- Для более глубокого программного управления (threads, возобновляемые workflow) рассмотрите Codex SDK и сохраняйте thread ID между запусками.
- `npx tsx ...` задокументирован для запуска TypeScript-скрипта; `tsx` сейчас не объявлен в `package.json` (установите его глобально или запускайте через `npx`).

## Устранение неполадок

| Симптом | Вероятная причина | Решение |
|---|---|---|
| `codex CLI not found in PATH` | CLI Codex не установлен или не обнаруживается | Установите CLI Codex и проверьте через `codex --help`. |
| `Not inside a Git repo` | Защита скрипта заблокировала запуск | Запустите внутри репозитория или передайте `--skip-git-check`. |
| `Session file is empty or missing` с `--session-mode resume` | Режим resume требует существующий источник ID | Сначала создайте/заполните файл сессии (например, через `--session-mode auto` или `--session-mode new`). |
| `python3 or python is required` (путь shell-скрипта) | Не установлен Python для разбора JSONL | Установите Python и повторите попытку. |
| Проблемы с `npx tsx` | Локально недоступна runtime-зависимость | Используйте `npx tsx ...` напрямую или добавьте `tsx` в локальные dev-зависимости. |

## Дорожная карта

- Добавить сгенерированные многоязычные README в `i18n/` и синхронизировать навигацию по языкам.
- Добавить алиасы npm-скриптов для типовых сценариев (`analyze:sh`, `analyze:ts`, `plan:task`).
- Добавить лёгкие проверки CI для линтинга shell-скриптов и примеров валидации схемы.
- Расширить примеры планировщика задач реальными шаблонами в `docs/`.

## Участие в разработке

Контрибьюции приветствуются.

Рекомендуемый процесс:
1. Создайте feature-ветку.
2. Держите изменения сфокусированными и соответствующими репозиторию.
3. Обновляйте docs/examples при изменении поведения CLI.
4. Откройте pull request с описанием изменений поведения и шагов валидации.

## Лицензия

В метаданных пакета указана лицензия `ISC` в `package.json`.

Примечание: отдельный файл `LICENSE` в этом checkout на момент написания отсутствовал.
