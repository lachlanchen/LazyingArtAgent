[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner](https://github.com/lachlanchen/lachlanchen/raw/main/figs/banner.png)](https://github.com/lachlanchen/lachlanchen/blob/main/figs/banner.png)

# 🧠 مساعدات سطر أوامر Codex (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 التركيز | 🧰 التفاصيل |
|---|---|
| استمرارية الجلسة | استئناف جلسات Codex والحفاظ عليها بين التنفيذات |
| جودة المخرجات | تمرير أحداث JSONL + تصدير الرسالة النهائية |
| دعم التخطيط | توليد خطوات مخططة بقاعدة مخطط (schema) للتحقق |
| البيئات | أوامر محلية وسير عمل مناسب لـ CI |

> أدوات CLI عملية لسير عمل Codex تحافظ على سياق الجلسة وتفرض مخرجات منظمة.

## 🎯 نظرة عامة

يوفر هذا المستودع أدوات سطر أوامر عملية وخفيفة لسير عمل مبني على Codex:

- تحليل قائمة الملفات في الدليل الحالي باستخدام Codex.
- استئناف جلسات Codex ومواصلة العمل عبر تنفيذات متعددة.
- تقسيم المهام الكبيرة إلى خطوات قابلة للتحقق ومقيدة بمخطط.
- الاحتفاظ بإرشادات الاستخدام وملاحظات SDK لفكرة سير عمل Codex المتطورة.

هذه الأدوات خفيفة الوزن وبشكل مقصود تعتمد على النصوص البرمجية، بحيث يمكنك تشغيلها من أي بيئة تتوفر فيها أداة `codex` والأدوات المساعدة المطلوبة.

## 🚀 القدرات السريعة

### نظرة سريعة

| المجال | ما الذي تحصل عليه |
|---|---|
| 🔁 استمرارية الجلسة | استئناف آخر جلسة، أو استخدام معرف جلسة صريح، أو ملفات جلسات ثابتة |
| 📤 التعامل مع المخرجات | بث أحداث JSONL وتصدير الرسالة النهائية |
| 🧩 تخطيط منظم | إخراج تقسيم المهمة بقيود مخطط JSON |
| 🛠️ نقطة دخول مزدوجة | تنفيذات Bash و TypeScript |
| 📚 سياق مدمج | إرشادات المشروع موجودة في `docs/` |

### 🧩 الميزات

- تنفيذ Codex المدرك للجلسة:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- التحكم بالمخرجات:
  - `--json` تمرير تدفق الأحداث
  - `--output-last-message <path>`
  - `--prompt <text>` بادئة موجه مخصصة
- سكربت مخطط خطة المهمة مع فرض المخطط:
  - `--task` أو `--file`
  - `--schema` لتجاوز
  - `--out` ملف الإخراج
- نقطة دخول لكل من الشل و TypeScript لتحليل القائمة.

## 🧱 هيكلة المشروع

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

## ✅ المتطلبات الأساسية

| المتطلب | لماذا هو مطلوب |
|---|---|
| `codex` CLI موجود في `PATH` | مطلوب لجميع سكربتات المساعدة |
| سياق مستودع Git (أو `--skip-git-check`) | تمنع السكربتات التشغيل غير المقصود خارج مستودع |
| `python3` (أو `python`) لـ `scripts/codex_analyze_ls.sh` | مطلوب لتحليل JSON عند تهيئة أو حفظ مخرجات الجلسة |
| Node.js 18+ لـ `scripts/codex_analyze_ls.ts` | بيئة تشغيل نقطة الدخول المكتوبة بـ TypeScript |

## 🔧 التثبيت

1. استنساخ المستودع.

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. تثبيت تبعيات Node.

   ```bash
   npm install
   ```

3. التحقق من توفر واجهة سطر أوامر Codex.

   ```bash
   codex --help
   ```

4. (اختياري) تهيئة الوحدات الفرعية إذا كنت تحتاج `vendor/codex` محليًا.

   ```bash
   git submodule update --init --recursive
   ```

الافتراض: `<repository-url>` هو عنوان Git البعيد الفعلي؛ حدّثه برابط المصدر الحقيقي الخاص بك.

## 🛠️ الاستخدام

### سكربت الشل: تحليل `ls -la`

نفّذ:

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

### 🧭 سكربت تقسيم المهمة

قسّم مهمة كبيرة إلى خطوات صغيرة قابلة للتحقق وأخرج JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

استخدم ملف مهمة واحفظ المخرجات:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

التحقق باستخدام مخطط مخصص:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### ⚙️ سكربت Node TypeScript: تحليل `ls -la`

نفّذ (باستخدام `tsx`):

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

## 🔁 سلوك الجلسة

`codex exec` يبدأ جلسة غير تفاعلية جديدة ما لم تستأنف جلسة صريحة. للاستمرار في جلسة سابقة، استخدم `codex exec resume --last` أو `codex exec resume <SESSION_ID>`. يمكنك العثور على معرفات الجلسات عبر أداة الاختيار التفاعلية `codex resume`، أو أمر `/status` داخل الجلسة، أو من داخل `~/.codex/sessions/`.

تدعم هذه السكربتات أيضًا `--session-file <path>` للحفاظ على معرف الجلسة. في أول تشغيل، تبدأ جلسة جديدة، وتخزن المعرف، ثم تعيد استخدامه في التشغيلات اللاحقة.

يمكنك التحكم بسلوك الجلسة باستخدام `--session-mode`:
- `auto` (افتراضي): استئناف إذا وجد ملف جلسة، وإلا بدء جلسة جديدة
- `new`: بدء جلسة جديدة دائمًا (ويحل محل ملف الجلسة إذا تم تمريره)
- `resume`: يتطلب وجود جلسة سابقة (`--session-file` أو `--session` أو `--resume-last`)

## 🧭 الإعداد

### `scripts/codex_analyze_ls.sh` و `scripts/codex_analyze_ls.ts`

| الخيار | الوصف |
|---|---|
| `--resume-last` | استئناف آخر جلسة تنفيذ |
| `--session <id>` | استئناف جلسة تنفيذ محددة |
| `--session-file <path>` | حفظ وإعادة استخدام معرف جلسة |
| `--session-mode <auto|new|resume>` | استراتيجية جلسة صريحة |
| `--skip-git-check` | تجاوز التحقق من وجود مستودع Git |
| `--json` | إخراج أحداث JSONL |
| `--output-last-message <path>` | كتابة الرسالة الختامية للمساعد |
| `--prompt <text>` | بادئة موجه مخصصة قبل القائمة المضمّنة |

قواعد القيود المطبقة على كلا سكربتي التحليل:
- `--resume-last` و `--session` متعارضان.
- لا يمكن دمج `--session-file` مع `--resume-last` أو `--session`.
- لا يمكن دمج `--session-mode new` مع أعلام الاستئناف الصريحة.
- `--session-mode resume` يتطلب وجود `--session-file` أو `--session` أو `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| الخيار | الوصف |
|---|---|
| `--task <text>` | مهمة مدمجة |
| `--file <path>` | نص المهمة من ملف |
| `--schema <path>` | ملف المخطط (افتراضي: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | كتابة JSON النهائي إلى ملف |
| `--skip-git-check` | تجاوز التحقق من وجود مستودع Git |

شكل المخطط (`schemas/task_breakdown.schema.json`):
- متطلبات المستوى الأعلى: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- المتطلبات لكل خطوة: `id`, `title`, `goal`, `verification`, `validation`
- اختياري لكل خطوة: `depends_on`

## 📎 أمثلة

### الاحتفاظ واستعادة جلسة عبر تنفيذات متعددة

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### حفظ الرسالة النهائية فقط

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### إنشاء مخطط خطة مهمة كـ JSON

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 📚 المستندات

- `docs/idea.md`: رؤية المنتج لوكيل تطوير التطبيقات بدعم من Codex
- `docs/codex-sdk.md`: ملاحظات تثبيت واستخدام Codex SDK

## 🧪 ملاحظات التطوير

- كلا سكربتي التحليل يرسلان موجه Codex إلى `codex` عبر stdin (`-`) لتجنب مشاكل تقييد الاقتباس في الشل.
- يطبع كلا السكربتين `Session ID: ...` إلى `stderr` حتى لا يتداخل مع `stdout` القابل للتحليل.
- يستخدم سكربت الشل `python3` (أو `python`) لتحليل JSONL عند تهيئة أو حفظ حالة الجلسة.
- للتحكم البرمجي الأعمق (استمرارية الخيوط، سير استئناف الجلسة)، يُفضَّل مراجعة ملاحظات Codex SDK في `docs/codex-sdk.md`.
- تم توثيق `npx tsx ...` لتشغيل سكربت TypeScript؛ لا يزال `tsx` غير معرف كتبع مباشر في `package.json`.

## 🧯 استكشاف الأخطاء وإصلاحها

| العَرَض | السبب المحتمل | الحل |
|---|---|---|
| `codex CLI not found in PATH` | أداة `codex` غير مثبتة أو غير قابلة للاكتشاف | ثبّت Codex CLI وتحقق عبر `codex --help`. |
| `Not inside a Git repo` | الحارس في السكربت منع التشغيل | شغّل داخل مستودع أو استخدم `--skip-git-check`. |
| `Session file is empty or missing` مع `--session-mode resume` | وضع الاستئناف يتطلب مصدر معرف جلسة موجود | أنشئ/اغرس ملف الجلسة أولًا (مثلًا عبر `--session-mode auto` أو `--session-mode new`). |
| `python3 or python is required` | مسار سكربت الشل يعتمد على تحليل Python | ثبّت Python ثم أعد المحاولة. |
| مشاكل `npx tsx` | تبعية زمن التشغيل غير متوفرة محليًا | نفّذ `npx tsx ...` مباشرة، أو أضف `tsx` كتبع تطوير محليًا. |

## 🗺️ خارطة الطريق

- إضافة ملفات README متعددة اللغات داخل `i18n/` ومزامنة روابط اللغة.
- إضافة أسماء مستعارة لـ npm للتدفقات الشائعة (`analyze:sh`, `analyze:ts`, `plan:task`).
- إضافة فحوص CI خفيفة للتحقق من جودة سكربتات الشل وصحة المخطط.
- توسيع أمثلة مخطط المهمة بقوالب تطبيقية من `docs/`.

## 🤝 المساهمة

المساهمات مرحب بها.

سير العمل المقترح:
1. إنشاء فرع ميزة.
2. إبقاء التغييرات مركزة ومتوافقة مع المستودع.
3. تحديث الأمثلة/المستندات عند تغيّر سلوك CLI.
4. فتح طلب سحب يصف تغييرات السلوك وخطوات التحقق.

## الترخيص

بيانات الحزمة تعلن أن الترخيص هو `ISC` في `package.json`.

ملاحظة: لم يكن ملف `LICENSE` المستقل موجودًا في هذه النسخة عند وقت الكتابة.


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
