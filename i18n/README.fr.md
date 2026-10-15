[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://lazying.art/media/brand/lazyingart-intro.gif)](https://lazying.art)

# 🧠 Aides d'exécution Codex (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 Focus | 🧰 Détails |
|---|---|
| Continuité de session | Reprise et persistance des sessions Codex entre les exécutions |
| Qualité de sortie | Passerelle d'événements JSONL + export du message final |
| Support de la planification | Génération d'étapes d'une tâche selon un schéma contraint |
| Environnements | Shells locaux et workflows adaptés à la CI |

> Helpers CLI pratiques pour les workflows Codex qui conservent le contexte de session et imposent des sorties structurées.

## 🎯 Aperçu

Ce dépôt propose des utilitaires en ligne de commande légers mais pratiques pour les workflows pilotés par Codex :

- Analyser la liste du répertoire courant avec Codex.
- Reprendre et continuer les sessions Codex entre les exécutions.
- Découper de grandes tâches en étapes vérifiables avec contraintes de schéma.
- Conserver des notes de guidance d'utilisation et des notes SDK pour faire évoluer les idées de workflows Codex.

Ces outils sont volontairement légers et orientés script afin de pouvoir les lancer depuis n'importe quel environnement où `codex` et les outils d'exécution requis sont disponibles.

## 🚀 Capacités rapides

### En un coup d'œil

| Domaine | Ce que vous obtenez |
|---|---|
| 🔁 Continuité de session | Reprise de la dernière session, IDs de session explicites, ou fichiers de session persistants |
| 📤 Gestion de sortie | Flux d'événements JSONL et export du message final |
| 🧩 Planification structurée | Sortie de découpage de tâches avec contraintes de schéma JSON |
| 🛠️ Double point d'entrée | Implémentations Bash et TypeScript |
| 📚 Contexte embarqué | Guide de projet dans `docs/` |

### 🧩 Fonctionnalités

- Exécution de Codex sensible à la session :
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Contrôle de sortie :
  - `--json` passage direct du flux d'événements
  - `--output-last-message <path>`
  - `--prompt <text>` préfixe de prompt personnalisé
- Script de découpage de tâches avec enforcement de schéma :
  - `--task` ou `--file`
  - `--schema` remplacement
  - `--out` fichier de sortie
- Deux points d'entrée shell et TypeScript pour l'analyse du listing.

## 🧱 Structure du projet

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

## ✅ Prérequis

| Exigence | Pourquoi c'est nécessaire |
|---|---|
| `codex` CLI dans `PATH` | Requis par tous les scripts d'assistance |
| Contexte de dépôt Git (ou `--skip-git-check`) | Les scripts vérifient pour éviter une exécution hors dépôt |
| `python3` (ou `python`) pour `scripts/codex_analyze_ls.sh` | Nécessaire pour le parsing JSON lors de l'initialisation/capture de la sortie de session |
| Node.js 18+ pour `scripts/codex_analyze_ls.ts` | Runtime du point d'entrée TypeScript |

## 🔧 Installation

1. Cloner le dépôt.

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. Installer les dépendances Node.

   ```bash
   npm install
   ```

3. Vérifier que le CLI Codex est disponible.

   ```bash
   codex --help
   ```

4. (Optionnel) initialiser les submodules si vous avez besoin de `vendor/codex` localement.

   ```bash
   git submodule update --init --recursive
   ```

Supposition : `<repository-url>` est l'URL de votre remote Git ; mettez votre origine réelle.

## 🛠️ Utilisation

### Script shell : analyse `ls -la`

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

### 🧭 Script de découpage des tâches

Découpez une grande tâche en petites étapes vérifiables et exportez du JSON :

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

### ⚙️ Script Node TypeScript : analyse `ls -la`

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

## 🔁 Comportement de session

`codex exec` démarre une nouvelle session non interactive sauf reprise explicite d'une session existante. Pour reprendre une session antérieure, utilisez `codex exec resume --last` ou `codex exec resume <SESSION_ID>`. Vous pouvez trouver les IDs de session via le sélecteur interactif `codex resume`, la commande `/status` dans une session, ou dans `~/.codex/sessions/`.

Ces scripts prennent aussi en charge `--session-file <path>` pour persister l'ID de session. Au premier lancement, ils démarrent une nouvelle session, enregistrent l'ID, puis la réutilisent lors des exécutions suivantes.

Vous pouvez contrôler le comportement de session avec `--session-mode` :
- `auto` (par défaut) : reprendre si un fichier de session existe, sinon démarrer une nouvelle session
- `new` : démarrer toujours une nouvelle session (écrase le fichier de session si fourni)
- `resume` : exiger une session existante (depuis `--session-file`, `--session`, ou `--resume-last`)

## 🧭 Configuration

### `scripts/codex_analyze_ls.sh` et `scripts/codex_analyze_ls.ts`

| Option | Description |
|---|---|
| `--resume-last` | Reprendre la session d'exécution la plus récente |
| `--session <id>` | Reprendre une session d'exécution spécifique |
| `--session-file <path>` | Persister et réutiliser un ID de session |
| `--session-mode <auto|new|resume>` | Stratégie de session explicite |
| `--skip-git-check` | Ignorer la vérification de dépôt Git |
| `--json` | Émettre les événements JSONL |
| `--output-last-message <path>` | Écrire le message final de l'assistant |
| `--prompt <text>` | Préfixe de prompt personnalisé avant le listing ajouté |

Contraintes appliquées par les deux scripts d'analyse :
- `--resume-last` et `--session` sont mutuellement exclusifs.
- `--session-file` ne peut pas être combiné avec `--resume-last` ou `--session`.
- `--session-mode new` ne peut pas être combiné avec des flags de reprise explicite.
- `--session-mode resume` requiert `--session-file`, `--session` ou `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Option | Description |
|---|---|
| `--task <text>` | Tâche en ligne |
| `--file <path>` | Texte de tâche depuis un fichier |
| `--schema <path>` | Fichier de schéma (par défaut : `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Écrire le JSON final dans un fichier |
| `--skip-git-check` | Ignorer la vérification de dépôt Git |

Forme du schéma (`schemas/task_breakdown.schema.json`) :
- Requis au niveau racine : `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Requis par étape : `id`, `title`, `goal`, `verification`, `validation`
- Optionnel par étape : `depends_on`

## 📎 Exemples

### Persister et réutiliser une session entre exécutions

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Enregistrer uniquement le message final de l'assistant

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Générer un artefact JSON de plan de tâche

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 📚 Docs

- `docs/idea.md` : vision produit de l'agent de développement d'applications propulsé par Codex
- `docs/codex-sdk.md` : notes d'installation et d'usage du Codex SDK

## 🧪 Notes de développement

- Les deux scripts d'analyse envoient le prompt Codex à `codex` via stdin (`-`) pour éviter les cas limites de guillemets shell.
- Les deux scripts affichent `Session ID: ...` sur `stderr` afin de ne pas interférer avec une sortie `stdout` analysable.
- Le script shell utilise `python3` (ou `python`) pour parser le JSONL lors de l'initialisation ou de l'enregistrement de l'état de session.
- Pour un contrôle programmatique plus poussé (persistance de thread, workflows de reprise), consultez les notes du Codex SDK dans `docs/codex-sdk.md`.
- `npx tsx ...` est documenté pour exécuter le script TypeScript ; `tsx` n'est pas déclaré comme dépendance directe dans `package.json`.

## 🧯 Dépannage

| Symptôme | Cause probable | Résolution |
|---|---|---|
| `codex CLI not found in PATH` | `codex` n'est pas installé ou introuvable | Installez le CLI Codex et vérifiez avec `codex --help`. |
| `Not inside a Git repo` | La vérification du dépôt bloque l'exécution | Exécutez depuis un dépôt Git ou passez `--skip-git-check`. |
| `Session file is empty or missing` with `--session-mode resume` | Le mode reprise exige une source d'ID existante | Créez/remplissez d'abord le fichier de session (par exemple avec `--session-mode auto` ou `--session-mode new`). |
| `python3 or python is required` | Le script shell dépend du parsing Python | Installez Python et relancez. |
| `npx tsx` issues | Dépendance runtime manquante localement | Lancez `npx tsx ...` directement, ou ajoutez `tsx` comme dépendance de développement locale. |

## 🗺️ Feuille de route

- Ajouter des README multilingues générés sous `i18n/` et garder la navigation des langues synchronisée.
- Ajouter des alias de scripts npm pour les flux courants (`analyze:sh`, `analyze:ts`, `plan:task`).
- Ajouter des vérifications CI légères pour le lint des scripts shell et la validation du schéma.
- Étendre les exemples du planificateur de tâches avec des templates concrets dans `docs/`.

## 🤝 Contribution

Les contributions sont les bienvenues.

Flux de travail recommandé :
1. Créez une branche de fonctionnalité.
2. Gardez les changements ciblés et fidèles au dépôt.
3. Mettez à jour la documentation/les exemples quand le comportement du CLI change.
4. Ouvrez une pull request décrivant les changements de comportement et les étapes de validation.

## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |

## License

Les métadonnées du package déclarent la licence `ISC` dans `package.json`.

Remarque : un fichier `LICENSE` indépendant n'était pas présent dans ce checkout au moment de la rédaction.
