[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://github.com/lachlanchen/LazyingArtWebsite/raw/main/media/brand/lazyingart-intro.gif)](https://lazying.art)

# 🧠 Помощники Codex Exec (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 Фокус | 🧰 Детали |
|---|---|
| Сохранение сессий | Возобновление и сохранение сессий Codex между запусками |
| Качество вывода | Проброс событий JSONL + экспорт финального сообщения |
| Поддержка планирования | Генерация разбиения задач с проверкой схемы |
| Окружения | Локальные оболочки и CI-ориентированные рабочие процессы |

> Практичные CLI-утилиты для рабочих процессов Codex, которые сохраняют контекст сессии и обеспечивают структурированные результаты.

## 🎯 Обзор

Этот репозиторий предоставляет практичные, но компактные инструменты командной строки для рабочих процессов с Codex:

- Анализ текущего содержимого каталога с помощью Codex.
- Возобновление и продолжение сессий Codex между запусками.
- Разбиение крупных задач на верифицируемые шаги с ограничениями схемы.
- Хранение рекомендаций по использованию и заметок по SDK для развивающихся идей рабочих процессов Codex.

Эти инструменты намеренно лёгкие и ориентированы на скрипты, поэтому их можно запускать в любом окружении, где доступны `codex` и необходимые runtime-инструменты.

## 🚀 Ключевые возможности

### Быстрый обзор

| Область | Что вы получаете |
|---|---|
| 🔁 Сохранение сессии | Возобновление последней сессии, явные ID сессий или постоянные файлы сессий |
| 📤 Обработка вывода | Потоковая передача событий JSONL и экспорт итогового сообщения |
| 🧩 Структурированное планирование | Вывод разбиения задач с проверкой JSON-схемы |
| 🛠️ Две точки входа | Реализации на Bash и TypeScript |
| 📚 Встроенный контекст | Руководство проекта в `docs/` |

### 🧩 Возможности

- Выполнение Codex с учётом сессии:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Управление выводом:
  - `--json` проброс потока событий
  - `--output-last-message <path>`
  - `--prompt <text>` пользовательский префикс prompt
- Скрипт планировщика задач с проверкой схемы:
  - `--task` или `--file`
  - `--schema`
  - `--out` файл вывода
- Обе точки входа для анализа списка: shell и TypeScript.

## 🧱 Структура проекта

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

## ✅ Требования

| Требование | Зачем нужно |
|---|---|
| `codex` CLI в `PATH` | Требуется для всех вспомогательных скриптов |
| Контекст Git-репозитория (или `--skip-git-check`) | Скрипты защищают от случайного запуска вне репозитория |
| `python3` (или `python`) для `scripts/codex_analyze_ls.sh` | Нужен для разбора JSON при инициализации/сохранении состояния сессии |
| Node.js 18+ для `scripts/codex_analyze_ls.ts` | Среда выполнения для TypeScript-скрипта |

## 🔧 Установка

1. Клонируйте репозиторий.

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. Установите зависимости Node.

   ```bash
   npm install
   ```

3. Проверьте доступность CLI Codex.

   ```bash
   codex --help
   ```

4. (Опционально) инициализируйте подмодули, если нужен локальный `vendor/codex`.

   ```bash
   git submodule update --init --recursive
   ```

Предположение: `<repository-url>` — это ваш remote URL репозитория; замените его на фактический origin.

## 🛠️ Использование

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

### 🧭 Скрипт разбиения задач

Разбейте большую задачу на небольшие проверяемые шаги и сохраните JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Используйте файл задачи и сохраните результат:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Проверьте с кастомным путём схемы:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### ⚙️ Node TypeScript скрипт: анализ `ls -la`

Запустите (с `tsx`):

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

## 🔁 Поведение сессии

`codex exec` запускает новую неинтерактивную сессию, если вы явно не восстанавливаете существующую. Чтобы продолжить предыдущую сессию, используйте `codex exec resume --last` или `codex exec resume <SESSION_ID>`. Найти ID сессий можно через интерактивный picker `codex resume`, команду `/status` внутри сессии или в `~/.codex/sessions/`.

Эти скрипты также поддерживают `--session-file <path>` для сохранения ID сессии. При первом запуске они создают новую сессию, сохраняют ID, а затем используют его в следующих запусках.

Управлять поведением сессии можно через `--session-mode`:
- `auto` (по умолчанию): возобновляет сессию, если есть файл сессии, иначе создает новую
- `new`: всегда начинается новая сессия (перезаписывает файл сессии, если передан)
- `resume`: требует существующую сессию (из `--session-file`, `--session` или `--resume-last`)

## 🧭 Конфигурация

### `scripts/codex_analyze_ls.sh` и `scripts/codex_analyze_ls.ts`

| Опция | Описание |
|---|---|
| `--resume-last` | Возобновляет самый последний запуск exec |
| `--session <id>` | Возобновляет конкретную сессию exec |
| `--session-file <path>` | Сохраняет и повторно использует ID сессии |
| `--session-mode <auto|new|resume>` | Явная стратегия работы сессии |
| `--skip-git-check` | Обходит проверку Git-репозитория |
| `--json` | Выводит события JSONL |
| `--output-last-message <path>` | Записывает финальное сообщение ассистента |
| `--prompt <text>` | Пользовательский префикс prompt перед добавленным списком |

Ограничения, которые применяются обоими скриптами анализа:
- `--resume-last` и `--session` взаимоисключают друг друга.
- `--session-file` нельзя сочетать с `--resume-last` или `--session`.
- `--session-mode new` нельзя использовать с явными флагами возобновления.
- `--session-mode resume` требует `--session-file`, `--session` или `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Опция | Описание |
|---|---|
| `--task <text>` | Встроенная задача |
| `--file <path>` | Текст задачи из файла |
| `--schema <path>` | Файл схемы (по умолчанию: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Записать итоговый JSON в файл |
| `--skip-git-check` | Обходит проверку Git-репозитория |

Схема (`schemas/task_breakdown.schema.json`):
- Обязательные поля верхнего уровня: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Обязательные поля для каждого шага: `id`, `title`, `goal`, `verification`, `validation`
- Дополнительные поля для каждого шага: `depends_on`

## 📎 Примеры

### Сохранять и повторно использовать сессию между запусками

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Сохранять только финальное сообщение ассистента

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Сгенерировать JSON-артефакт плана задач

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 📚 Документация

- `docs/idea.md`: продуктовая идея для агента разработки приложений на базе Codex
- `docs/codex-sdk.md`: заметки по установке и использованию Codex SDK

## 🧪 Заметки по разработке

- Оба скрипта анализируют данные и передают prompt Codex через stdin (`-`), чтобы избежать проблем с экранированием в shell.
- Оба скрипта печатают `Session ID: ...` в `stderr`, чтобы не мешать парсингу `stdout`.
- Shell-скрипт использует `python3` (или `python`) для разбора JSONL при инициализации или сохранении состояния сессии.
- Для более глубокого программного контроля (сохранение потоков, процессы возобновления) смотрите заметки по Codex SDK в `docs/codex-sdk.md`.
- Для запуска TypeScript-скрипта описан `npx tsx ...`; сейчас `tsx` не объявлен как прямая зависимость в `package.json`.

## 🧯 Устранение неисправностей

| Симптом | Вероятная причина | Решение |
|---|---|---|
| `codex CLI not found in PATH` | `codex` не установлен или недоступен | Установите Codex CLI и проверьте `codex --help`. |
| `Not inside a Git repo` | Скрипт остановлен защитной проверкой | Запускайте внутри репозитория или укажите `--skip-git-check`. |
| `Session file is empty or missing` с `--session-mode resume` | Для режима возобновления требуется существующий источник ID | Создайте/инициализируйте файл сессии сначала (например, с `--session-mode auto` или `--session-mode new`). |
| `python3 or python is required` | Для пути shell-скрипта необходим Python-парсер | Установите Python и повторите попытку. |
| Проблемы с `npx tsx` | Локально отсутствует runtime-зависимость | Запускайте `npx tsx ...` напрямую или добавьте `tsx` как dev-зависимость локально. |

## 🗺️ Дорожная карта

- Добавить автоматически сгенерированные многоязычные README файлы в `i18n/` и поддерживать синхронизированную языковую навигацию.
- Добавить npm-алиасы для типовых сценариев (`analyze:sh`, `analyze:ts`, `plan:task`).
- Добавить лёгкие CI-проверки для lint shell-скриптов и валидации схем.
- Расширить примеры планировщика задач реальными шаблонами в `docs/`.

## 🤝 Участие

Идеи и контрибьюции приветствуются.

Предлагаемый процесс:
1. Создайте feature branch.
2. Держите изменения сфокусированными и точными относительно репозитория.
3. Обновляйте примеры и документацию при изменении поведения CLI.
4. Откройте pull request с описанием изменений и шагов проверки.

## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |

## License

- Основная метаинформация пакета объявляет лицензию `ISC` в `package.json`.

Примечание: в этой проверке отдельный файл `LICENSE` в репозитории отсутствовал.
