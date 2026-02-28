[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> Estos scripts ejecutan `ls -la` y luego le piden a Codex que analice el listado.

## Resumen

Este repositorio ofrece helpers de CLI prácticos para flujos de trabajo impulsados por Codex:
- Analizar el listado del directorio actual con Codex usando Bash o TypeScript.
- Persistir y reanudar sesiones de exec de Codex entre ejecuciones.
- Dividir tareas grandes en pasos JSON pequeños y verificables, aplicando un esquema.

El repositorio también contiene una visión temprana del producto y notas del SDK para un agente de desarrollo más amplio impulsado por Codex.

### Vista Rápida

| Área | Qué obtienes |
|---|---|
| 🔁 Continuidad de sesión | Reanudar la última sesión, IDs de sesión explícitos o archivos de sesión persistentes |
| 📤 Manejo de salida | Modo de stream JSONL y exportación del mensaje final |
| 🧩 Planificación estructurada | Flujo de desglose de tareas restringido por esquema JSON |
| 🛠️ Implementación dual | Entry points en shell y TypeScript para el análisis de listados |
| 📚 Notas del proyecto | Visión del producto + notas del Codex SDK en `docs/` |

## Características

- Ejecución de Codex con reconocimiento de sesión:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Control de salida:
  - `--json` passthrough de stream de eventos
  - `--output-last-message <path>`
  - `--prompt <text>` prefijo de prompt personalizado
- Script de planificación de tareas con aplicación de esquema:
  - `--task` o `--file`
  - `--schema` override
  - `--out` archivo de salida
- Ambos entry points, shell y TypeScript, para análisis de listados.

## Estructura del Proyecto

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

## Comportamiento de Sesión

`codex exec` inicia una sesión no interactiva nueva, a menos que reanudes una explícitamente. Para continuar una sesión previa, usa `codex exec resume --last` o `codex exec resume <SESSION_ID>`. Puedes encontrar IDs de sesión mediante el selector interactivo `codex resume`, el comando `/status` dentro de una sesión, o en `~/.codex/sessions/`.

Estos scripts también admiten `--session-file <path>` para persistir el ID de sesión. En la primera ejecución, inician una nueva sesión, guardan el ID y luego lo reutilizan en ejecuciones posteriores.

Puedes controlar el comportamiento de sesión con `--session-mode`:
- `auto` (predeterminado): reanuda si existe un archivo de sesión; de lo contrario, inicia una sesión nueva
- `new`: siempre inicia una sesión nueva (sobrescribe el archivo de sesión si se proporciona)
- `resume`: requiere una sesión existente (desde `--session-file`, `--session` o `--resume-last`)

## Requisitos Previos

| Requisito | Por qué se necesita |
|---|---|
| `codex` CLI en `PATH` | Requerido por todos los scripts helper |
| Contexto de repositorio Git (o `--skip-git-check`) | Los scripts evitan ejecuciones accidentales fuera de un repo |
| `python3` (o `python`) para `scripts/codex_analyze_ls.sh` | Necesario para parsear JSON al inicializar/capturar salida de sesión |
| Node.js 18+ para `scripts/codex_analyze_ls.ts` | Runtime recomendado para el entry point de TypeScript |

## Instalación

1. Clona el repositorio.
2. Instala las dependencias de Node:

```bash
npm install
```

3. Asegúrate de que la CLI `codex` esté instalada y disponible:

```bash
codex --help
```

4. Opcional: inicializa submodules si quieres acceso local a `vendor/codex`:

```bash
git submodule update --init --recursive
```

Nota: `.gitmodules` declara `vendor/codex`, pero podría no estar inicializado en algunos checkouts.

## Uso

### Script Shell: Analizar `ls -la`

Ejecuta:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

Otros ejemplos:

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

### Script de Desglose de Tareas

Divide una tarea grande en pasos pequeños y verificables, y genera JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Usa un archivo de tarea y guarda la salida:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Valida con una ruta de esquema personalizada:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Script Node TypeScript: Analizar `ls -la`

Ejecuta (con `tsx`):

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

Otros ejemplos:

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

## Configuración

### `scripts/codex_analyze_ls.sh` and `scripts/codex_analyze_ls.ts`

| Opción | Descripción |
|---|---|
| `--resume-last` | Reanuda la sesión de exec más reciente |
| `--session <id>` | Reanuda una sesión de exec específica |
| `--session-file <path>` | Persiste y reutiliza un ID de sesión |
| `--session-mode <auto|new|resume>` | Estrategia de sesión explícita |
| `--skip-git-check` | Omite la validación de repositorio Git |
| `--json` | Emite eventos JSONL |
| `--output-last-message <path>` | Escribe el mensaje final del asistente |
| `--prompt <text>` | Prefijo de prompt personalizado antes del listado anexado |

Reglas de restricciones aplicadas por ambos scripts de análisis:
- `--resume-last` y `--session` son mutuamente excluyentes.
- `--session-file` no puede combinarse con `--resume-last` ni con `--session`.
- `--session-mode new` no puede combinarse con flags de reanudación explícitos.
- `--session-mode resume` requiere `--session-file`, `--session` o `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Opción | Descripción |
|---|---|
| `--task <text>` | Tarea inline |
| `--file <path>` | Texto de tarea desde archivo |
| `--schema <path>` | Archivo de esquema (predeterminado: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Escribe el JSON final en un archivo |
| `--skip-git-check` | Omite la validación de repositorio Git |

Forma del esquema (`schemas/task_breakdown.schema.json`):
- Requerido en nivel superior: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Requerido por paso: `id`, `title`, `goal`, `verification`, `validation`
- Opcional por paso: `depends_on`

## Ejemplos

### Persistir y reutilizar una sesión entre ejecuciones

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Guardar solo el mensaje final del asistente

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Generar un artefacto JSON de plan de tareas

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## Documentación

- `docs/idea.md`: visión del producto para el agente de desarrollo de aplicaciones impulsado por Codex
- `docs/codex-sdk.md`: notas de instalación y uso del Codex SDK

## Notas de Desarrollo

- Ambos scripts de análisis envían el prompt a `codex` vía stdin (`-`), lo que evita problemas de shell-quoting.
- Ambos scripts imprimen `Session ID: ...` en stderr para que no interfiera con stdout.
- El script shell usa `python3` (o `python`) para parsear JSONL al inicializar un archivo de sesión.
- Para un control programático más profundo (threads, flujos reanudables), considera el Codex SDK y almacena el thread ID entre ejecuciones.
- `npx tsx ...` se documenta para ejecutar el script TypeScript; `tsx` no está declarado actualmente en `package.json` (instálalo globalmente o ejecútalo con `npx`).

## Solución de Problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| `codex CLI not found in PATH` | La CLI de Codex no está instalada o no es detectable | Instala la CLI de Codex y verifica con `codex --help`. |
| `Not inside a Git repo` | La protección del script bloqueó la ejecución | Ejecuta dentro de un repositorio o usa `--skip-git-check`. |
| `Session file is empty or missing` con `--session-mode resume` | El modo de reanudación requiere una fuente de ID existente | Crea o inicializa primero el archivo de sesión (por ejemplo con `--session-mode auto` o `--session-mode new`). |
| `python3 or python is required` (ruta del script shell) | Falta Python para parsear JSONL | Instala Python y vuelve a intentarlo. |
| Problemas con `npx tsx` | La dependencia de runtime no está disponible localmente | Usa `npx tsx ...` directamente, o agrega `tsx` como dependencia de desarrollo local. |

## Hoja de Ruta

- Agregar archivos README multilingües generados en `i18n/` y mantener sincronizada la navegación de idiomas.
- Agregar alias de scripts npm para flujos comunes (`analyze:sh`, `analyze:ts`, `plan:task`).
- Agregar validaciones ligeras en CI para linting de scripts shell y ejemplos de validación de esquemas.
- Ampliar los ejemplos del planificador de tareas con plantillas del mundo real en `docs/`.

## Contribuciones

Las contribuciones son bienvenidas.

Flujo de trabajo sugerido:
1. Crea una rama de funcionalidad.
2. Mantén los cambios acotados y fieles al repositorio.
3. Actualiza docs/ejemplos cuando cambie el comportamiento de la CLI.
4. Abre un pull request describiendo los cambios de comportamiento y los pasos de validación.

## Licencia

Los metadatos del paquete declaran la licencia `ISC` en `package.json`.

Nota: no había un archivo `LICENSE` independiente en este checkout al momento de redactar este documento.
