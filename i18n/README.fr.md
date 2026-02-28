[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> Ces scripts exécutent `ls -la`, puis demandent à Codex d’analyser le résultat.

## Aperçu

Ce dépôt fournit des helpers CLI pratiques pour des workflows pilotés par Codex :
- Analyser la liste du répertoire courant avec Codex via Bash ou TypeScript.
- Persister et reprendre des sessions `codex exec` entre plusieurs exécutions.
- Découper de grosses tâches en petites étapes JSON vérifiables, contraintes par un schéma.

Le dépôt contient aussi une vision produit initiale et des notes SDK pour un agent de développement plus large propulsé par Codex.

### En bref

| Domaine | Ce que vous obtenez |
|---|---|
| 🔁 Continuité de session | Reprise de la dernière session, IDs explicites, ou fichiers de session persistants |
| 📤 Gestion de la sortie | Mode flux JSONL et export du dernier message |
| 🧩 Planification structurée | Workflow de découpage de tâches contraint par schéma JSON |
| 🛠️ Double implémentation | Entrées shell et TypeScript pour l’analyse de listing |
| 📚 Notes projet | Vision produit + notes Codex SDK dans `docs/` |

## Fonctionnalités

- Exécution Codex sensible à la session :
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Contrôle de la sortie :
  - `--json` passthrough du flux d’événements
  - `--output-last-message <path>`
  - `--prompt <text>` préfixe de prompt personnalisé
- Script de planification de tâches avec validation par schéma :
  - `--task` ou `--file`
  - `--schema` pour surcharge
  - `--out` fichier de sortie
- Entrées shell et TypeScript pour l’analyse de listing.

## Structure du projet

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

## Comportement des sessions

`codex exec` démarre une nouvelle session non interactive, sauf si vous en reprenez explicitement une. Pour continuer une session précédente, utilisez `codex exec resume --last` ou `codex exec resume <SESSION_ID>`. Vous pouvez trouver les IDs de session via le sélecteur interactif `codex resume`, la commande `/status` dans une session, ou dans `~/.codex/sessions/`.

Ces scripts prennent aussi en charge `--session-file <path>` pour persister l’ID de session. Lors de la première exécution, ils démarrent une nouvelle session, enregistrent l’ID, puis le réutilisent aux exécutions suivantes.

Vous pouvez contrôler le comportement de session avec `--session-mode` :
- `auto` (par défaut) : reprend si un fichier de session existe, sinon démarre une nouvelle session
- `new` : démarre toujours une nouvelle session (écrase le fichier de session s’il est fourni)
- `resume` : exige une session existante (depuis `--session-file`, `--session`, ou `--resume-last`)

## Prérequis

| Exigence | Pourquoi c’est nécessaire |
|---|---|
| `codex` CLI dans `PATH` | Requis par tous les scripts helper |
| Contexte de dépôt Git (ou `--skip-git-check`) | Les scripts protègent contre une exécution hors dépôt par erreur |
| `python3` (ou `python`) pour `scripts/codex_analyze_ls.sh` | Nécessaire pour parser le JSON lors de l’initialisation/capture de la sortie de session |
| Node.js 18+ pour `scripts/codex_analyze_ls.ts` | Runtime recommandé pour l’entrée TypeScript |

## Installation

1. Clonez le dépôt.
2. Installez les dépendances Node :

```bash
npm install
```

3. Vérifiez que le CLI `codex` est installé et disponible :

```bash
codex --help
```

4. Optionnel : initialisez les submodules si vous voulez un accès local à `vendor/codex` :

```bash
git submodule update --init --recursive
```

Remarque : `.gitmodules` déclare `vendor/codex`, mais il peut ne pas être initialisé dans certains checkouts.

## Utilisation

### Script shell : analyser `ls -la`

Exécuter :

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

Autres exemples :

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

### Script de découpage de tâches

Découpez une grande tâche en petites étapes vérifiables et sortez du JSON :

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Utiliser un fichier de tâche et enregistrer la sortie :

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Valider avec un chemin de schéma personnalisé :

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Script Node TypeScript : analyser `ls -la`

Exécuter (avec `tsx`) :

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

Autres exemples :

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

## Configuration

### `scripts/codex_analyze_ls.sh` and `scripts/codex_analyze_ls.ts`

| Option | Description |
|---|---|
| `--resume-last` | Reprendre la session exec la plus récente |
| `--session <id>` | Reprendre une session exec spécifique |
| `--session-file <path>` | Persister et réutiliser un ID de session |
| `--session-mode <auto|new|resume>` | Stratégie de session explicite |
| `--skip-git-check` | Ignore la vérification de dépôt Git |
| `--json` | Émet les événements JSONL |
| `--output-last-message <path>` | Écrit le message final de l’assistant |
| `--prompt <text>` | Préfixe de prompt personnalisé avant le listing ajouté |

Règles de contrainte appliquées par les deux scripts d’analyse :
- `--resume-last` et `--session` sont mutuellement exclusifs.
- `--session-file` ne peut pas être combiné avec `--resume-last` ou `--session`.
- `--session-mode new` ne peut pas être combiné avec des flags explicites de reprise.
- `--session-mode resume` exige `--session-file`, `--session`, ou `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Option | Description |
|---|---|
| `--task <text>` | Tâche inline |
| `--file <path>` | Texte de tâche depuis un fichier |
| `--schema <path>` | Fichier de schéma (par défaut : `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Écrire le JSON final dans un fichier |
| `--skip-git-check` | Ignore la vérification de dépôt Git |

Structure du schéma (`schemas/task_breakdown.schema.json`) :
- Requis au niveau racine : `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Requis par étape : `id`, `title`, `goal`, `verification`, `validation`
- Optionnel par étape : `depends_on`

## Exemples

### Persister et réutiliser une session entre exécutions

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Enregistrer uniquement le message final de l’assistant

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Générer un artefact JSON de planification de tâche

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## Docs

- `docs/idea.md` : vision produit pour l’agent de développement d’apps propulsé par Codex
- `docs/codex-sdk.md` : notes d’installation et d’usage du Codex SDK

## Notes de développement

- Les deux scripts d’analyse envoient le prompt à `codex` via stdin (`-`), ce qui évite les problèmes de quoting shell.
- Les deux scripts affichent `Session ID: ...` sur stderr pour ne pas perturber stdout.
- Le script shell utilise `python3` (ou `python`) pour parser le JSONL lors de l’initialisation d’un fichier de session.
- Pour un contrôle programmatique plus poussé (threads, workflows reprenables), envisagez le Codex SDK et stockez le thread ID entre les exécutions.
- `npx tsx ...` est documenté pour exécuter le script TypeScript ; `tsx` n’est actuellement pas déclaré dans `package.json` (installez-le globalement ou exécutez via `npx`).

## Dépannage

| Symptôme | Cause probable | Résolution |
|---|---|---|
| `codex CLI not found in PATH` | Le CLI Codex n’est pas installé ou introuvable | Installez le CLI Codex et vérifiez avec `codex --help`. |
| `Not inside a Git repo` | Le garde-fou du script a bloqué l’exécution | Exécutez dans un dépôt ou passez `--skip-git-check`. |
| `Session file is empty or missing` with `--session-mode resume` | Le mode reprise exige une source d’ID existante | Créez/initialisez d’abord le fichier de session (par exemple avec `--session-mode auto` ou `--session-mode new`). |
| `python3 or python is required` (shell script path) | Python manquant pour le parsing JSONL | Installez Python et réessayez. |
| `npx tsx` issues | Dépendance runtime indisponible localement | Utilisez `npx tsx ...` directement, ou ajoutez `tsx` en dépendance de dev locale. |

## Feuille de route

- Ajouter les fichiers README multilingues générés sous `i18n/` et garder la navigation des langues synchronisée.
- Ajouter des alias de scripts npm pour les workflows courants (`analyze:sh`, `analyze:ts`, `plan:task`).
- Ajouter des vérifications CI légères pour le lint des scripts shell et des exemples de validation de schéma.
- Étendre les exemples du planificateur de tâches avec des templates concrets dans `docs/`.

## Contribution

Les contributions sont les bienvenues.

Workflow suggéré :
1. Créez une branche de fonctionnalité.
2. Gardez des changements ciblés et fidèles au dépôt.
3. Mettez à jour docs/exemples quand le comportement CLI change.
4. Ouvrez une pull request décrivant les changements de comportement et les étapes de validation.

## Licence

Les métadonnées du package déclarent la licence `ISC` dans `package.json`.

Remarque : un fichier `LICENSE` autonome n’était pas présent dans ce checkout au moment de la rédaction.
