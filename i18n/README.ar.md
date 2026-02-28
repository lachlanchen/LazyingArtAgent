[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# مساعدات Codex Exec (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> تقوم هذه السكربتات بتشغيل `ls -la`، ثم تطلب من Codex تحليل الناتج.

## نظرة عامة

يوفّر هذا المستودع مساعدات CLI عملية لتدفقات عمل تعتمد على Codex:
- تحليل عرض الدليل الحالي باستخدام Codex عبر Bash أو TypeScript.
- حفظ جلسات Codex exec واستئنافها بين التشغيلات.
- تقسيم المهام الكبيرة إلى خطوات JSON صغيرة قابلة للتحقق مع فرض مخطط (schema).

يحتوي المستودع أيضًا على رؤية مبكرة للمنتج وملاحظات SDK لمساعد تطوير أوسع يعمل بواسطة Codex.

### لمحة سريعة

| المجال | ما الذي تحصل عليه |
|---|---|
| 🔁 استمرارية الجلسة | استئناف آخر جلسة، ومعرّفات جلسات صريحة، أو ملفات جلسات دائمة |
| 📤 التعامل مع المخرجات | وضع تدفق JSONL وتصدير الرسالة النهائية |
| 🧩 تخطيط منظم | سير عمل تقسيم مهام مقيّد بمخطط JSON |
| 🛠️ تنفيذ مزدوج | نقاط دخول Shell وTypeScript لتحليل القوائم |
| 📚 ملاحظات المشروع | رؤية المنتج + ملاحظات Codex SDK داخل `docs/` |

## الميزات

- تنفيذ Codex مدرك للجلسة:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- التحكم في المخرجات:
  - `--json` تمرير مباشر لتدفق الأحداث
  - `--output-last-message <path>`
  - `--prompt <text>` بادئة موجه مخصصة
- سكربت مخطِّط المهام مع فرض المخطط:
  - `--task` أو `--file`
  - `--schema` لتجاوز المسار الافتراضي
  - `--out` ملف المخرجات
- نقاط دخول Shell وTypeScript لتحليل القوائم.

## بنية المشروع

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

## سلوك الجلسة

يبدأ `codex exec` جلسة جديدة غير تفاعلية ما لم تقم باستئناف جلسة صراحةً. لمتابعة جلسة سابقة، استخدم `codex exec resume --last` أو `codex exec resume <SESSION_ID>`. يمكنك العثور على معرّفات الجلسات عبر أداة الاختيار التفاعلية `codex resume`، أو الأمر `/status` داخل الجلسة، أو داخل `~/.codex/sessions/`.

تدعم هذه السكربتات أيضًا `--session-file <path>` لحفظ معرّف الجلسة. في التشغيل الأول تبدأ جلسة جديدة، وتحفظ المعرّف، ثم تعيد استخدامه في التشغيلات اللاحقة.

يمكنك التحكم في سلوك الجلسة باستخدام `--session-mode`:
- `auto` (الافتراضي): يستأنف إذا وُجد ملف جلسة، وإلا يبدأ جلسة جديدة
- `new`: يبدأ دائمًا جلسة جديدة (ويستبدل ملف الجلسة إذا تم تمريره)
- `resume`: يتطلب جلسة موجودة مسبقًا (من `--session-file` أو `--session` أو `--resume-last`)

## المتطلبات المسبقة

| المتطلب | سبب الحاجة إليه |
|---|---|
| `codex` CLI في `PATH` | مطلوب بواسطة جميع السكربتات المساعدة |
| سياق مستودع Git (أو `--skip-git-check`) | السكربتات تمنع التشغيل غير المقصود خارج المستودع |
| `python3` (أو `python`) لملف `scripts/codex_analyze_ls.sh` | مطلوب لتحليل JSON عند تهيئة/التقاط مخرجات الجلسة |
| Node.js 18+ لملف `scripts/codex_analyze_ls.ts` | بيئة التشغيل الموصى بها لنقطة دخول TypeScript |

## التثبيت

1. استنسخ المستودع.
2. ثبّت اعتماديات Node:

```bash
npm install
```

3. تأكد أن `codex` CLI مثبت ومتاح:

```bash
codex --help
```

4. اختياري: هيّئ الوحدات الفرعية إذا أردت وصولًا محليًا إلى `vendor/codex`:

```bash
git submodule update --init --recursive
```

ملاحظة: يعرّف `.gitmodules` المسار `vendor/codex`، لكنه قد يكون غير مهيأ في بعض النسخ.

## الاستخدام

### سكربت Shell: تحليل `ls -la`

شغّل:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

أمثلة أخرى:

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

### سكربت تقسيم المهام

قسّم مهمة كبيرة إلى خطوات صغيرة قابلة للتحقق وأخرج النتيجة بصيغة JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

استخدم ملف مهمة واحفظ المخرجات:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

تحقق باستخدام مسار مخطط مخصص:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### سكربت Node TypeScript: تحليل `ls -la`

شغّل (باستخدام `tsx`):

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

أمثلة أخرى:

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

## الإعداد

### `scripts/codex_analyze_ls.sh` و `scripts/codex_analyze_ls.ts`

| الخيار | الوصف |
|---|---|
| `--resume-last` | استئناف أحدث جلسة exec |
| `--session <id>` | استئناف جلسة exec محددة |
| `--session-file <path>` | حفظ معرّف الجلسة وإعادة استخدامه |
| `--session-mode <auto|new|resume>` | استراتيجية جلسة صريحة |
| `--skip-git-check` | تجاوز التحقق من مستودع Git |
| `--json` | إخراج أحداث JSONL |
| `--output-last-message <path>` | كتابة الرسالة النهائية للمساعد |
| `--prompt <text>` | بادئة موجه مخصصة قبل القائمة الملحقة |

قواعد القيود المفروضة بواسطة سكربتي التحليل:
- `--resume-last` و `--session` خياران متنافيان.
- لا يمكن دمج `--session-file` مع `--resume-last` أو `--session`.
- لا يمكن دمج `--session-mode new` مع أعلام الاستئناف الصريحة.
- يتطلب `--session-mode resume` أحد: `--session-file` أو `--session` أو `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| الخيار | الوصف |
|---|---|
| `--task <text>` | مهمة مضمّنة مباشرة |
| `--file <path>` | نص المهمة من ملف |
| `--schema <path>` | ملف المخطط (الافتراضي: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | كتابة JSON النهائي إلى ملف |
| `--skip-git-check` | تجاوز التحقق من مستودع Git |

شكل المخطط (`schemas/task_breakdown.schema.json`):
- مطلوب على المستوى الأعلى: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- مطلوب لكل خطوة: `id`, `title`, `goal`, `verification`, `validation`
- اختياري لكل خطوة: `depends_on`

## أمثلة

### حفظ جلسة وإعادة استخدامها عبر التشغيلات

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### حفظ الرسالة النهائية للمساعد فقط

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### إنشاء ملف JSON لخطة مهمة

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## المستندات

- `docs/idea.md`: رؤية المنتج لمساعد تطوير التطبيقات المعتمد على Codex
- `docs/codex-sdk.md`: ملاحظات تثبيت واستخدام Codex SDK

## ملاحظات التطوير

- كلا سكربتي التحليل يرسلان الموجه إلى `codex` عبر stdin (`-`) لتجنب مشكلات اقتباس الصدفة.
- كلا السكربتين يطبعان `Session ID: ...` إلى stderr كي لا يتداخل ذلك مع stdout.
- يستخدم سكربت Shell `python3` (أو `python`) لتحليل JSONL عند تهيئة ملف جلسة.
- للتحكم البرمجي الأعمق (الخيوط وسير العمل القابل للاستئناف)، فكّر في Codex SDK وخزّن معرّف الخيط بين التشغيلات.
- التوثيق يستخدم `npx tsx ...` لتشغيل سكربت TypeScript؛ الحزمة `tsx` غير مصرّح بها حاليًا في `package.json` (ثبّتها عالميًا أو شغّلها عبر `npx`).

## استكشاف الأخطاء وإصلاحها

| العرَض | السبب المرجّح | الحل |
|---|---|---|
| `codex CLI not found in PATH` | Codex CLI غير مثبت أو غير قابل للاكتشاف | ثبّت Codex CLI وتحقق عبر `codex --help`. |
| `Not inside a Git repo` | حماية السكربت منعت التنفيذ | شغّل داخل مستودع أو مرّر `--skip-git-check`. |
| `Session file is empty or missing` مع `--session-mode resume` | وضع الاستئناف يتطلب مصدر معرّف موجود مسبقًا | أنشئ/هيّئ ملف الجلسة أولًا (مثلًا عبر `--session-mode auto` أو `--session-mode new`). |
| `python3 or python is required` (مسار سكربت Shell) | Python مفقود لتحليل JSONL | ثبّت Python ثم أعد المحاولة. |
| مشكلات `npx tsx` | اعتماد بيئة التشغيل غير متاح محليًا | استخدم `npx tsx ...` مباشرة، أو أضف `tsx` كاعتماد تطوير محلي. |

## خارطة الطريق

- إضافة ملفات README متعددة اللغات مُولّدة تحت `i18n/` مع إبقاء شريط اللغات متزامنًا.
- إضافة أسماء مختصرة لأوامر npm للتدفقات الشائعة (`analyze:sh`, `analyze:ts`, `plan:task`).
- إضافة فحوصات CI خفيفة لتدقيق سكربتات shell وأمثلة التحقق من المخطط.
- توسيع أمثلة مخطط المهام بقوالب واقعية داخل `docs/`.

## المساهمة

المساهمات مرحّب بها.

سير العمل المقترح:
1. أنشئ فرع ميزة.
2. حافظ على تركيز التغييرات ودقتها بالنسبة للمستودع.
3. حدّث المستندات/الأمثلة عند تغيّر سلوك CLI.
4. افتح طلب سحب يصف تغيّرات السلوك وخطوات التحقق.

## الترخيص

تُصرّح بيانات الحزمة بترخيص `ISC` في `package.json`.

ملاحظة: لم يكن ملف `LICENSE` مستقلًا موجودًا في هذه النسخة عند وقت الكتابة.
