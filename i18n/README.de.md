[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> Diese Skripte führen `ls -la` aus und lassen Codex anschließend die Auflistung analysieren.

## Überblick

Dieses Repository stellt praxistaugliche CLI-Helfer für Codex-gestützte Workflows bereit:
- Analyse der aktuellen Verzeichnisauflistung mit Codex, wahlweise per Bash oder TypeScript.
- Persistieren und Fortsetzen von Codex-Exec-Sitzungen über mehrere Läufe hinweg.
- Zerlegen großer Aufgaben in kleine, überprüfbare JSON-Schritte, erzwungen durch ein Schema.

Das Repository enthält außerdem frühe Produktvisionen und SDK-Notizen für einen umfassenderen, von Codex unterstützten Entwicklungsagenten.

### Auf einen Blick

| Bereich | Was enthalten ist |
|---|---|
| 🔁 Sitzungs-Kontinuität | Fortsetzen der letzten Sitzung, explizite Sitzungs-IDs oder persistente Sitzungsdateien |
| 📤 Ausgabe-Verarbeitung | JSONL-Stream-Modus und Export der finalen Nachricht |
| 🧩 Strukturierte Planung | JSON-Schema-begrenzter Workflow zur Aufgabenzerlegung |
| 🛠️ Doppelte Implementierung | Shell- und TypeScript-Einstiegspunkte für Listing-Analysen |
| 📚 Projektnotizen | Produktvision + Codex-SDK-Notizen in `docs/` |

## Funktionen

- Sitzungsbewusste Codex-Ausführung:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Ausgabesteuerung:
  - `--json` Event-Stream-Durchleitung
  - `--output-last-message <path>`
  - `--prompt <text>` benutzerdefiniertes Prompt-Präfix
- Aufgabenplaner-Skript mit Schema-Durchsetzung:
  - `--task` oder `--file`
  - `--schema` überschreiben
  - `--out` Ausgabedatei
- Sowohl Shell- als auch TypeScript-Einstiegspunkte für Listing-Analysen.

## Projektstruktur

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

## Sitzungsverhalten

`codex exec` startet eine neue, nicht-interaktive Sitzung, sofern du nicht explizit eine bestehende fortsetzt. Um eine frühere Sitzung fortzusetzen, nutze `codex exec resume --last` oder `codex exec resume <SESSION_ID>`. Sitzungs-IDs findest du über den interaktiven `codex resume`-Picker, den `/status`-Befehl innerhalb einer Sitzung oder in `~/.codex/sessions/`.

Diese Skripte unterstützen außerdem `--session-file <path>`, um die Sitzungs-ID zu persistieren. Beim ersten Lauf starten sie eine neue Sitzung, speichern die ID und verwenden sie bei folgenden Läufen wieder.

Du kannst das Sitzungsverhalten mit `--session-mode` steuern:
- `auto` (Standard): fortsetzen, wenn eine Sitzungsdatei existiert, andernfalls neue Sitzung starten
- `new`: immer eine neue Sitzung starten (überschreibt die Sitzungsdatei, falls angegeben)
- `resume`: verlangt eine bestehende Sitzung (aus `--session-file`, `--session` oder `--resume-last`)

## Voraussetzungen

| Voraussetzung | Warum sie benötigt wird |
|---|---|
| `codex` CLI in `PATH` | Von allen Hilfsskripten benötigt |
| Git-Repository-Kontext (oder `--skip-git-check`) | Skripte verhindern versehentliche Ausführung außerhalb eines Repositories |
| `python3` (oder `python`) für `scripts/codex_analyze_ls.sh` | Für JSON-Parsing beim Initialisieren/Erfassen von Sitzungsausgaben nötig |
| Node.js 18+ für `scripts/codex_analyze_ls.ts` | Empfohlene Laufzeit für den TypeScript-Einstiegspunkt |

## Installation

1. Repository klonen.
2. Node-Abhängigkeiten installieren:

```bash
npm install
```

3. Sicherstellen, dass die `codex` CLI installiert und verfügbar ist:

```bash
codex --help
```

4. Optional: Submodule initialisieren, wenn du lokal auf `vendor/codex` zugreifen möchtest:

```bash
git submodule update --init --recursive
```

Hinweis: `.gitmodules` deklariert `vendor/codex`, es kann in manchen Checkouts jedoch nicht initialisiert sein.

## Verwendung

### Shell-Skript: `ls -la` analysieren

Ausführen:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

Weitere Beispiele:

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

### Task-Breakdown-Skript

Eine große Aufgabe in kleine, überprüfbare Schritte aufteilen und JSON ausgeben:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Aufgabendatei verwenden und Ausgabe speichern:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Mit benutzerdefiniertem Schema-Pfad validieren:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Node-TypeScript-Skript: `ls -la` analysieren

Ausführen (mit `tsx`):

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

Weitere Beispiele:

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

## Konfiguration

### `scripts/codex_analyze_ls.sh` und `scripts/codex_analyze_ls.ts`

| Option | Beschreibung |
|---|---|
| `--resume-last` | Die zuletzt verwendete Exec-Sitzung fortsetzen |
| `--session <id>` | Eine bestimmte Exec-Sitzung fortsetzen |
| `--session-file <path>` | Sitzungs-ID persistieren und wiederverwenden |
| `--session-mode <auto|new|resume>` | Explizite Sitzungsstrategie |
| `--skip-git-check` | Git-Repository-Prüfung umgehen |
| `--json` | JSONL-Events ausgeben |
| `--output-last-message <path>` | Finale Assistant-Nachricht schreiben |
| `--prompt <text>` | Benutzerdefiniertes Prompt-Präfix vor angehängtem Listing |

Von beiden Analyze-Skripten erzwungene Constraint-Regeln:
- `--resume-last` und `--session` schließen sich gegenseitig aus.
- `--session-file` kann nicht mit `--resume-last` oder `--session` kombiniert werden.
- `--session-mode new` kann nicht mit expliziten Resume-Flags kombiniert werden.
- `--session-mode resume` erfordert `--session-file`, `--session` oder `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Option | Beschreibung |
|---|---|
| `--task <text>` | Inline-Aufgabe |
| `--file <path>` | Aufgabentext aus Datei |
| `--schema <path>` | Schema-Datei (Standard: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Finales JSON in Datei schreiben |
| `--skip-git-check` | Git-Repository-Prüfung umgehen |

Schema-Form (`schemas/task_breakdown.schema.json`):
- Erforderlich auf oberster Ebene: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Pro Schritt erforderlich: `id`, `title`, `goal`, `verification`, `validation`
- Optional pro Schritt: `depends_on`

## Beispiele

### Eine Sitzung über mehrere Läufe hinweg persistieren und wiederverwenden

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Nur die finale Assistant-Nachricht speichern

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Ein Aufgabenplan-JSON-Artefakt generieren

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## Doku

- `docs/idea.md`: Produktvision für den Codex-gestützten App-Entwicklungsagenten
- `docs/codex-sdk.md`: Installations- und Nutzungshinweise zum Codex SDK

## Entwicklungshinweise

- Beide Analyze-Skripte senden den Prompt via stdin (`-`) an `codex`; das vermeidet Shell-Quoting-Probleme.
- Beide Skripte geben `Session ID: ...` auf stderr aus, damit stdout nicht beeinträchtigt wird.
- Das Shell-Skript verwendet `python3` (oder `python`), um JSONL beim Initialisieren einer Sitzungsdatei zu parsen.
- Für tiefere programmatische Kontrolle (Threads, wiederaufnehmbare Workflows) empfiehlt sich das Codex SDK; speichere dafür die Thread-ID zwischen den Läufen.
- `npx tsx ...` ist für das Ausführen des TypeScript-Skripts dokumentiert; `tsx` ist aktuell nicht in `package.json` deklariert (global installieren oder via `npx` ausführen).

## Fehlerbehebung

| Symptom | Wahrscheinliche Ursache | Lösung |
|---|---|---|
| `codex CLI not found in PATH` | Codex CLI ist nicht installiert oder nicht auffindbar | Codex CLI installieren und mit `codex --help` prüfen. |
| `Not inside a Git repo` | Skriptschutz hat die Ausführung blockiert | In einem Repository ausführen oder `--skip-git-check` übergeben. |
| `Session file is empty or missing` mit `--session-mode resume` | Resume-Modus benötigt eine bestehende ID-Quelle | Sitzungsdatei zuerst erstellen/befüllen (z. B. mit `--session-mode auto` oder `--session-mode new`). |
| `python3 or python is required` (shell script path) | Python fehlt für JSONL-Parsing | Python installieren und erneut versuchen. |
| `npx tsx` issues | Laufzeitabhängigkeit lokal nicht verfügbar | `npx tsx ...` direkt verwenden oder `tsx` lokal als Dev-Abhängigkeit hinzufügen. |

## Roadmap

- Generierte mehrsprachige README-Dateien unter `i18n/` hinzufügen und die Sprach-Navigation synchron halten.
- npm-Skript-Aliasse für gängige Abläufe hinzufügen (`analyze:sh`, `analyze:ts`, `plan:task`).
- Leichtgewichtige CI-Prüfungen für Shell-Skript-Linting und Schema-Validierungsbeispiele hinzufügen.
- Aufgabenplaner-Beispiele mit realen Vorlagen in `docs/` erweitern.

## Mitwirken

Beiträge sind willkommen.

Empfohlener Ablauf:
1. Feature-Branch erstellen.
2. Änderungen fokussiert und repository-genau halten.
3. Doku/Beispiele aktualisieren, wenn sich CLI-Verhalten ändert.
4. Pull Request mit Beschreibung der Verhaltensänderungen und Validierungsschritte öffnen.

## Lizenz

Die Paketmetadaten deklarieren die Lizenz `ISC` in `package.json`.

Hinweis: Eine eigenständige `LICENSE`-Datei war zum Zeitpunkt der Erstellung in diesem Checkout nicht vorhanden.
