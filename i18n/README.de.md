[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://github.com/lachlanchen/LazyingArtWebsite/raw/main/media/brand/lazyingart-intro.gif)](https://lazying.art)

# 🧠 Codex Exec Helfer (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 Fokus | 🧰 Details |
|---|---|
| Sitzungskontinuität | Codex-Sitzungen über mehrere Läufe hinweg wiederaufnehmen und persistieren |
| Ausgabequalität | JSONL-Event-Pass-Through + Export der finalen Nachricht |
| Planungsunterstützung | Aufgabengliederung mit schemaerzwungenen, verifizierbaren Schritten |
| Umgebungen | Lokale Shells und CI-freundliche Workflows |

> Praktische CLI-Helfer für Codex-Workflows, die den Sitzungszustand bewahren und strukturierte Ausgaben durchsetzen.

## 🎯 Überblick

Dieses Repository stellt praktische CLI-Hilfen für Codex-gestützte Workflows bereit:

- Analysieren der aktuellen Verzeichnisauflistung mit Codex.
- Fortsetzen und Weiterführen von Codex-Sitzungen über mehrere Läufe hinweg.
- Zerlegen großer Aufgaben in schema-konforme, überprüfbare Schritte.
- Pflege von Nutzungsleitfäden und SDK-Hinweisen für weiterentwickelte Codex-Workflow-Ideen.

Diese Tools sind bewusst leichtgewichtig und skriptorientiert, damit sie in jeder Umgebung laufen, in der `codex` sowie die benötigten Runtime-Tools verfügbar sind.

## 🚀 Schnelle Funktionen

### Auf einen Blick

| Bereich | Was du bekommst |
|---|---|
| 🔁 Sitzungskontinuität | Letzte Sitzung, explizite Sitzungs-IDs oder persistente Sitzungsdateien wiederherstellen |
| 📤 Ausgabe-Handling | JSONL-Event-Streaming und Export der finalen Nachricht |
| 🧩 Strukturierte Planung | Ausgabestruktur für Aufgabenzerlegung mit JSON-Schema |
| 🛠️ Zwei Einstiegspunkte | Bash- und TypeScript-Implementierungen |
| 📚 Eingebetteter Kontext | Projekthinweise in `docs/` |

### 🧩 Funktionen

- Sitzungsbewusste Codex-Ausführung:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Ausgabekontrolle:
  - `--json` Event-Stream-Pass-Through
  - `--output-last-message <path>`
  - `--prompt <text>` benutzerdefiniertes Prompt-Präfix
- Aufgabenplaner-Skript mit Schema-Validierung:
  - `--task` oder `--file`
  - `--schema`-Überschreibung
  - `--out` Ausgabedatei
- Bash- und TypeScript-Einstiegspunkte für die Analyse der Auflistung.

## 🧱 Projektstruktur

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

## ✅ Voraussetzungen

| Anforderung | Warum benötigt |
|---|---|
| `codex` CLI in `PATH` | Erforderlich für alle Hilfsskripte |
| Git-Repository-Kontext (oder `--skip-git-check`) | Skripte verhindern versehentliche Ausführung außerhalb eines Repos |
| `python3` (oder `python`) für `scripts/codex_analyze_ls.sh` | Wird für JSON-Parsing beim Initialisieren/Speichern von Sitzungs-Output benötigt |
| Node.js 18+ für `scripts/codex_analyze_ls.ts` | Runtime für den TypeScript-Einstiegspunkt |

## 🔧 Installation

1. Repository klonen.

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. Node-Abhängigkeiten installieren.

   ```bash
   npm install
   ```

3. Prüfen, ob die Codex CLI verfügbar ist.

   ```bash
   codex --help
   ```

4. (Optional) Submodule initialisieren, wenn du `vendor/codex` lokal brauchst.

   ```bash
   git submodule update --init --recursive
   ```

Annahme: `<repository-url>` ist deine Git-Remote-URL; ersetze dies durch dein tatsächliches Origin.

## 🛠️ Nutzung

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

### 🧭 Aufgaben-Zerlegungs-Skript

Teile eine große Aufgabe in kleine, überprüfbare Schritte auf und gib JSON aus:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Mit einer Aufgabendatei arbeiten und Ausgabe speichern:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Mit benutzerdefiniertem Schema validieren:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### ⚙️ Node-TypeScript-Skript: `ls -la` analysieren

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

## 🔁 Sitzungsverhalten

`codex exec` startet eine neue nicht-interaktive Sitzung, solange du nicht explizit eine bestehende fortsetzt. Um eine frühere Sitzung fortzusetzen, verwende `codex exec resume --last` oder `codex exec resume <SESSION_ID>`. Sitzungs-IDs findest du über den interaktiven `codex resume`-Auswahlbildschirm, den `/status`-Befehl innerhalb einer Sitzung oder in `~/.codex/sessions/`.

Diese Skripte unterstützen außerdem `--session-file <path>`, um die Sitzungs-ID persistent zu speichern. Beim ersten Lauf starten sie eine neue Sitzung, speichern die ID und verwenden sie bei späteren Läufen erneut.

Das Sitzungsverhalten lässt sich über `--session-mode` steuern:
- `auto` (Standard): Sitzung wiederaufnehmen, falls eine Sitzungsdatei existiert, andernfalls neue Sitzung starten
- `new`: immer eine neue Sitzung starten (überschreibt die Sitzungsdatei, falls angegeben)
- `resume`: eine vorhandene Sitzung erzwingen (`--session-file`, `--session` oder `--resume-last`)

## 🧭 Konfiguration

### `scripts/codex_analyze_ls.sh` und `scripts/codex_analyze_ls.ts`

| Option | Beschreibung |
|---|---|
| `--resume-last` | Die zuletzt ausgeführte Exec-Sitzung fortsetzen |
| `--session <id>` | Eine bestimmte Exec-Sitzung fortsetzen |
| `--session-file <path>` | Sitzungs-ID speichern und wiederverwenden |
| `--session-mode <auto|new|resume>` | Explizite Sitzungsstrategie |
| `--skip-git-check` | Git-Repository-Prüfung überspringen |
| `--json` | JSONL-Events ausgeben |
| `--output-last-message <path>` | Letzte Assistentennachricht schreiben |
| `--prompt <text>` | Benutzerdefiniertes Prompt-Präfix vor angehängter Auflistung |

Von beiden Analyse-Skripten erzwungene Einschränkungen:
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

Schema-Struktur (`schemas/task_breakdown.schema.json`):
- Auf oberster Ebene erforderlich: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Erforderlich pro Schritt: `id`, `title`, `goal`, `verification`, `validation`
- Optional pro Schritt: `depends_on`

## 📎 Beispiele

### Eine Sitzung über mehrere Läufe hinweg speichern und wiederverwenden

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Nur die finale Assistentennachricht speichern

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Ein Aufgabenplan-JSON-Artefakt erzeugen

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 📚 Dokumentation

- `docs/idea.md`: Produktvision für den durch Codex unterstützten App-Entwicklungs-Agenten
- `docs/codex-sdk.md`: Installations- und Nutzungsnotizen zum Codex SDK

## 🧪 Entwicklungsnotizen

- Beide Analyse-Skripte senden den Codex-Prompt über stdin (`-`) an `codex`, um Shell-Quoting-Grenzfälle zu vermeiden.
- Beide Skripte schreiben `Session ID: ...` auf `stderr`, damit parsebare `stdout`-Ausgaben nicht beeinflusst werden.
- Das Shell-Skript nutzt `python3` (oder `python`) zum Parsen von JSONL beim Initialisieren oder Speichern des Sitzungsstatus.
- Für vertiefte programmgesteuerte Kontrolle (Thread-Persistenz, Resume-Workflows) siehe die Codex-SDK-Hinweise in `docs/codex-sdk.md`.
- `npx tsx ...` ist für das Ausführen des TypeScript-Skripts dokumentiert; `tsx` ist aktuell nicht direkt als Abhängigkeit in `package.json` eingetragen.

## 🧯 Fehlerbehebung

| Symptom | Wahrscheinliche Ursache | Lösung |
|---|---|---|
| `codex CLI not found in PATH` | `codex` ist nicht installiert oder nicht auffindbar | Codex CLI installieren und mit `codex --help` prüfen. |
| `Not inside a Git repo` | Skript-Schutz blockiert die Ausführung | In einem Repository arbeiten oder `--skip-git-check` setzen. |
| `Session file is empty or missing` mit `--session-mode resume` | Resume-Modus erfordert eine vorhandene ID-Quelle | Erstellt/initialisiert die Sitzungsdatei zuerst (z. B. mit `--session-mode auto` oder `--session-mode new`). |
| `python3 or python is required` | Shell-Skript-Pfad benötigt Python für das JSON-Parsing | Python installieren und erneut versuchen. |
| `npx tsx` Probleme | Lokale Laufzeit-Abhängigkeit fehlt | `npx tsx ...` direkt ausführen oder `tsx` lokal als Dev-Abhängigkeit hinzufügen. |

## 🗺️ Roadmap

- Mehrsprachige README-Dateien unter `i18n/` hinzufügen und Sprachnavigation konsistent halten.
- Npm-Skript-Aliase für häufige Abläufe hinzufügen (`analyze:sh`, `analyze:ts`, `plan:task`).
- Leichte CI-Prüfungen für Shell-Skript-Linting und Schemavalidierung hinzufügen.
- Aufgabenplaner-Beispiele mit praxisnahen Vorlagen in `docs/` erweitern.

## 🤝 Mitwirken

Beiträge sind willkommen.

Empfohlener Ablauf:
1. Feature-Branch erstellen.
2. Änderungen fokussiert halten und zum Repo-Inhalt passen.
3. Dokumentation/Beispiele aktualisieren, wenn sich CLI-Verhalten ändert.
4. Pull Request mit Verhaltensänderungen und Validierungsschritten öffnen.

## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |

## License

Die Paket-Metadaten deklarieren die Lizenz `ISC` in `package.json`.

Hinweis: Eine eigenständige `LICENSE`-Datei war in diesem Checkout zum Zeitpunkt der Erstellung nicht vorhanden.
