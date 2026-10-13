[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://github.com/lachlanchen/LazyingArtWebsite/raw/main/media/brand/lazyingart-intro.gif)](https://lazying.art)

# 🧠 Ayudantes de Codex (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 Focus | 🧰 Detalles |
|---|---|
| Continuidad de sesión | Reanudar y persistir sesiones de Codex entre ejecuciones |
| Calidad de salida | Transmisión de eventos JSONL + exportación del mensaje final |
| Soporte de planificación | Generación de descomposición de tareas con esquema obligatorio |
| Entornos | Shell local y flujos de trabajo compatibles con CI |

> Utilidades prácticas de CLI para flujos de trabajo con Codex que preservan el contexto de sesión y fuerzan salidas estructuradas.

## 🎯 Descripción general

Este repositorio ofrece herramientas de línea de comandos pequeñas pero útiles para flujos de trabajo impulsados por Codex:

- Analizar el listado del directorio actual con Codex.
- Reanudar y continuar sesiones de Codex entre ejecuciones.
- Dividir tareas grandes en pasos verificables y con restricciones de esquema.
- Mantener guías de uso y notas del SDK a medida que evolucionan las ideas de flujo de trabajo con Codex.

Estas herramientas están diseñadas para ser ligeras y de enfoque “script-first”, de modo que puedas ejecutarlas desde cualquier entorno donde `codex` y las herramientas de ejecución requeridas estén disponibles.

## 🚀 Capacidades rápidas

### A simple vista

| Área | Qué obtienes |
|---|---|
| 🔁 Continuidad de sesión | Reanudar la última sesión, usar IDs de sesión explícitos o archivos de sesión persistentes |
| 📤 Manejo de salida | Transmisión de eventos JSONL y exportación del mensaje final |
| 🧩 Planificación estructurada | Salida de descomposición de tareas restringida por esquema JSON |
| 🛠️ Doble punto de entrada | Implementaciones en Bash y TypeScript |
| 📚 Contexto integrado | Guías del proyecto en `docs/` |

### 🧩 Funcionalidades

- Ejecución de Codex con conciencia de sesión:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Control de salida:
  - `--json` retransmisión de stream de eventos
  - `--output-last-message <path>`
  - `--prompt <text>` prefijo de prompt personalizado
- Script de planificación de tareas con validación por esquema:
  - `--task` o `--file`
  - `--schema` override
  - `--out` archivo de salida
- Punto de entrada tanto de shell como de TypeScript para el análisis del listado.

## 🧱 Estructura del proyecto

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

## ✅ Prerrequisitos

| Requisito | Por qué es necesario |
|---|---|
| `codex` CLI en `PATH` | Requerido por todos los scripts de ayuda |
| Contexto de repositorio Git (o `--skip-git-check`) | Los scripts evitan ejecuciones accidentales fuera de un repositorio |
| `python3` (o `python`) para `scripts/codex_analyze_ls.sh` | Necesario para analizar JSON al inicializar/capturar la salida de sesión |
| Node.js 18+ para `scripts/codex_analyze_ls.ts` | Runtime para el punto de entrada de TypeScript |

## 🔧 Instalación

1. Clona el repositorio.

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. Instala dependencias de Node.

   ```bash
   npm install
   ```

3. Verifica que la CLI de Codex esté disponible.

   ```bash
   codex --help
   ```

4. (Opcional) inicializa submódulos si necesitas `vendor/codex` localmente.

   ```bash
   git submodule update --init --recursive
   ```

Supuesto: `<repository-url>` es la URL remota de tu repositorio; sustitúyela por tu origen real.

## 🛠️ Uso

### Script de shell: Analizar `ls -la`

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

### 🧭 Script de desglose de tareas

Divide una tarea grande en pasos pequeños y verificables y genera JSON:

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

### ⚙️ Script de Node TypeScript: Analizar `ls -la`

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

## 🔁 Comportamiento de sesión

`codex exec` inicia una sesión no interactiva nueva a menos que reanudes explícitamente una existente. Para continuar una sesión anterior, usa `codex exec resume --last` o `codex exec resume <SESSION_ID>`. Puedes encontrar IDs de sesión mediante el selector interactivo `codex resume`, el comando `/status` dentro de una sesión o en `~/.codex/sessions/`.

Estos scripts también soportan `--session-file <path>` para persistir el ID de sesión. En la primera ejecución, inician una sesión nueva, guardan el ID y luego lo reutilizan en ejecuciones siguientes.

Puedes controlar el comportamiento de sesión con `--session-mode`:
- `auto` (predeterminado): reanuda si existe un archivo de sesión, de lo contrario inicia una sesión nueva
- `new`: siempre inicia una sesión nueva (sobrescribe el archivo de sesión si se proporciona)
- `resume`: requiere una sesión existente (de `--session-file`, `--session` o `--resume-last`)

## 🧭 Configuración

### `scripts/codex_analyze_ls.sh` y `scripts/codex_analyze_ls.ts`

| Opción | Descripción |
|---|---|
| `--resume-last` | Reanuda la ejecución más reciente de Codex |
| `--session <id>` | Reanuda una ejecución concreta de Codex |
| `--session-file <path>` | Persiste y reutiliza un ID de sesión |
| `--session-mode <auto|new|resume>` | Estrategia de sesión explícita |
| `--skip-git-check` | Omitir la comprobación de repositorio Git |
| `--json` | Emite eventos JSONL |
| `--output-last-message <path>` | Escribe el mensaje final del asistente |
| `--prompt <text>` | Prefijo de prompt personalizado antes del listado añadido |

Reglas de restricción aplicadas por ambos scripts de análisis:
- `--resume-last` y `--session` son mutuamente excluyentes.
- `--session-file` no puede combinarse con `--resume-last` o `--session`.
- `--session-mode new` no puede combinarse con flags de reanudación explícita.
- `--session-mode resume` requiere `--session-file`, `--session` o `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Opción | Descripción |
|---|---|
| `--task <text>` | Tarea inline |
| `--file <path>` | Texto de tarea desde archivo |
| `--schema <path>` | Archivo de esquema (predeterminado: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Escribe el JSON final en un archivo |
| `--skip-git-check` | Omitir la comprobación de repositorio Git |

Forma del esquema (`schemas/task_breakdown.schema.json`):
- Nivel superior obligatorio: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Obligatorio por paso: `id`, `title`, `goal`, `verification`, `validation`
- Opcional por paso: `depends_on`

## 📎 Ejemplos

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

## 📚 Documentación

- `docs/idea.md`: visión del producto para el agente de desarrollo con Codex
- `docs/codex-sdk.md`: notas de instalación y uso del SDK de Codex

---

## 🧪 Notas de desarrollo

- Ambos scripts de análisis envían el prompt de Codex a `codex` vía stdin (`-`) para evitar casos límite de comillas del shell.
- Ambos scripts imprimen `Session ID: ...` en `stderr` para no interferir con la salida parseable en `stdout`.
- El script de shell usa `python3` (o `python`) para analizar JSONL al inicializar o guardar el estado de sesión.
- Para un control programático más profundo (persistencia de hilos, flujos de reanudación), consulta las notas del SDK de Codex en `docs/codex-sdk.md`.
- `npx tsx ...` está documentado para ejecutar el script de TypeScript; `tsx` actualmente no está declarado como dependencia directa en `package.json`.

## 🧯 Solución de problemas

| Síntoma | Causa probable | Resolución |
|---|---|---|
| `codex CLI not found in PATH` | `codex` no está instalado o no se puede encontrar | Instala la CLI de Codex y verifica con `codex --help`. |
| `Not inside a Git repo` | El control de guardia del script bloqueó la ejecución | Ejecuta dentro de un repositorio o usa `--skip-git-check`. |
| `Session file is empty or missing` con `--session-mode resume` | El modo de reanudación requiere una fuente de ID existente | Crea/semilla el archivo de sesión primero (por ejemplo con `--session-mode auto` o `--session-mode new`). |
| `python3 or python is required` | La ruta del script de shell depende del parseo en Python | Instala Python y vuelve a intentarlo. |
| `npx tsx` issues | Falta una dependencia de runtime local | Ejecuta `npx tsx ...` directamente o añade `tsx` como dependencia de desarrollo local. |

## 🗺️ Hoja de ruta

- Añadir archivos de README multilingües generados bajo `i18n/` y mantener sincronizada la navegación de idiomas.
- Añadir aliases de npm para flujos comunes (`analyze:sh`, `analyze:ts`, `plan:task`).
- Añadir comprobaciones de CI ligeras para lint de scripts y validación de esquemas.
- Ampliar ejemplos de planificación de tareas con plantillas del mundo real en `docs/`.

## 🤝 Contribución

Las contribuciones son bienvenidas.

Flujo sugerido:
1. Crea una rama de funcionalidad.
2. Mantén cambios enfocados y precisos respecto al repositorio.
3. Actualiza docs/ejemplos cuando cambie el comportamiento de la CLI.
4. Abre un pull request describiendo cambios de comportamiento y pasos de validación.

## Licencia

El metadato del paquete declara licencia `ISC` en `package.json`.

Nota: no había un archivo `LICENSE` independiente en este checkout en el momento de redactar este README.


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
