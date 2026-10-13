[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://github.com/lachlanchen/LazyingArtWebsite/raw/main/media/brand/lazyingart-intro.gif)](https://lazying.art)

# 🧠 Trợ lý dòng lệnh Codex (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white&style=for-the-badge)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational?style=for-the-badge)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f?style=for-the-badge)
![Language Stack](https://img.shields.io/badge/languages-Bash%20%2F%20TypeScript-0f766e?style=for-the-badge&logo=typescript&logoColor=white)

| 🎯 Mục tiêu | 🧰 Chi tiết |
|---|---|
| Liên tục phiên làm việc | Tiếp tục và duy trì phiên Codex qua các lần chạy |
| Chất lượng đầu ra | Truyền sự kiện JSONL + xuất thông điệp cuối |
| Hỗ trợ lập kế hoạch | Sinh bước công việc theo lược đồ được ràng buộc |
| Môi trường | Shell cục bộ và quy trình làm việc thân thiện CI |

> Các tiện ích CLI thực tế cho quy trình Codex giúp giữ nguyên ngữ cảnh phiên và đảm bảo đầu ra có cấu trúc.

## 🎯 Tổng quan

Repo này cung cấp bộ công cụ dòng lệnh nhỏ nhưng hữu ích cho quy trình làm việc dựa trên Codex:

- Phân tích danh sách thư mục hiện tại với Codex.
- Tiếp tục và tiếp nối các phiên Codex qua nhiều lần chạy.
- Chia các nhiệm vụ lớn thành các bước có thể xác minh theo lược đồ.
- Giữ tài liệu hướng dẫn sử dụng và ghi chú SDK của Codex cho các ý tưởng quy trình mới.

Những công cụ này được thiết kế nhẹ và theo hướng script để bạn có thể chạy ở bất kỳ môi trường nào có `codex` và các công cụ runtime kèm theo.

## 🚀 Năng lực nhanh

### Tổng quan nhanh

| Khu vực | Bạn nhận được gì |
|---|---|
| 🔁 Liên tục phiên làm việc | Khôi phục phiên gần nhất, ID phiên rõ ràng hoặc tệp phiên liên tục |
| 📤 Xử lý đầu ra | Phát luồng sự kiện JSONL và xuất thông điệp cuối |
| 🧩 Lập kế hoạch có cấu trúc | Đầu ra chia nhiệm vụ theo ràng buộc lược đồ JSON |
| 🛠️ Hai điểm vào | Triển khai Bash và TypeScript |
| 📚 Ngữ cảnh nhúng | Hướng dẫn dự án trong `docs/` |

### 🧩 Tính năng

- Thực thi Codex có nhận biết phiên:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Kiểm soát đầu ra:
  - `--json` truyền tiếp luồng sự kiện
  - `--output-last-message <path>`
  - `--prompt <text>` tiền tố prompt tuỳ chỉnh
- Trình lập kế hoạch nhiệm vụ với ràng buộc lược đồ:
  - `--task` hoặc `--file`
  - `--schema` ghi đè
  - `--out` tệp đầu ra
- Cả điểm vào shell và TypeScript cho phân tích listing.

## 🧱 Cấu trúc dự án

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

## ✅ Điều kiện tiên quyết

| Yêu cầu | Vì sao cần |
|---|---|
| `codex` CLI trong `PATH` | Bắt buộc bởi mọi script trợ giúp |
| Bối cảnh repository Git (hoặc `--skip-git-check`) | Các script tránh chạy nhầm trong môi trường không phải repo |
| `python3` (hoặc `python`) cho `scripts/codex_analyze_ls.sh` | Cần để phân tích JSON khi khởi tạo/ghi lại đầu ra phiên |
| Node.js 18+ cho `scripts/codex_analyze_ls.ts` | Runtime cho điểm vào TypeScript |

## 🔧 Cài đặt

1. Clone repository.

   ```bash
   git clone <repository-url>
   cd LazyingArtAgent
   ```

2. Cài đặt dependencies Node.

   ```bash
   npm install
   ```

3. Kiểm tra Codex CLI đã sẵn sàng.

   ```bash
   codex --help
   ```

4. (Tuỳ chọn) khởi tạo submodule nếu cần `vendor/codex` tại máy local.

   ```bash
   git submodule update --init --recursive
   ```

Giả định: `<repository-url>` là URL remote của bạn; hãy thay bằng origin thực tế.

## 🛠️ Cách dùng

### Script Shell: Phân tích `ls -la`

Chạy:

```bash
scripts/codex_analyze_ls.sh --skip-git-check
```

Các ví dụ khác:

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

### 🧭 Script phân tách nhiệm vụ

Tách một nhiệm vụ lớn thành các bước nhỏ, có thể xác minh và xuất JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Dùng file nhiệm vụ và lưu đầu ra:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Xác thực với một đường dẫn lược đồ tuỳ chỉnh:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### ⚙️ Script Node TypeScript: Phân tích `ls -la`

Chạy (với `tsx`):

```bash
npx tsx scripts/codex_analyze_ls.ts --skip-git-check
```

Các ví dụ khác:

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

## 🔁 Hành vi phiên

`codex exec` bắt đầu phiên không tương tác mới nếu bạn không chủ động tiếp tục một phiên trước đó. Để tiếp tục phiên cũ, dùng `codex exec resume --last` hoặc `codex exec resume <SESSION_ID>`. Bạn có thể tìm ID phiên qua bộ chọn tương tác `codex resume`, lệnh `/status` trong phiên, hoặc tại `~/.codex/sessions/`.

Các script này cũng hỗ trợ `--session-file <path>` để lưu trữ ID phiên. Lần chạy đầu tiên chúng bắt đầu một phiên mới, lưu ID, sau đó tái sử dụng ở các lần chạy tiếp theo.

Bạn có thể kiểm soát hành vi phiên bằng `--session-mode`:
- `auto` (mặc định): tiếp tục nếu tồn tại tệp phiên, nếu không thì bắt đầu phiên mới
- `new`: luôn bắt đầu phiên mới (ghi đè tệp phiên nếu được cung cấp)
- `resume`: yêu cầu một phiên hiện có (từ `--session-file`, `--session` hoặc `--resume-last`)

## 🧭 Cấu hình

### `scripts/codex_analyze_ls.sh` và `scripts/codex_analyze_ls.ts`

| Tùy chọn | Mô tả |
|---|---|
| `--resume-last` | Tiếp tục phiên exec gần nhất |
| `--session <id>` | Tiếp tục một phiên exec cụ thể |
| `--session-file <path>` | Lưu trữ và tái sử dụng một ID phiên |
| `--session-mode <auto|new|resume>` | Chiến lược phiên rõ ràng |
| `--skip-git-check` | Bỏ qua kiểm tra repository Git |
| `--json` | Phát ra các sự kiện JSONL |
| `--output-last-message <path>` | Ghi thông điệp trợ lý cuối |
| `--prompt <text>` | Tiền tố prompt tuỳ chỉnh trước khi gắn thêm listing |

Các quy tắc ràng buộc được áp dụng bởi cả hai script phân tích:
- `--resume-last` và `--session` không thể dùng đồng thời.
- `--session-file` không thể kết hợp với `--resume-last` hoặc `--session`.
- `--session-mode new` không thể kết hợp với các cờ tiếp tục rõ ràng.
- `--session-mode resume` đòi hỏi `--session-file`, `--session` hoặc `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Tùy chọn | Mô tả |
|---|---|
| `--task <text>` | Nhiệm vụ inline |
| `--file <path>` | Văn bản nhiệm vụ từ file |
| `--schema <path>` | Tệp lược đồ (mặc định: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Ghi JSON cuối cùng vào file |
| `--skip-git-check` | Bỏ qua kiểm tra repository Git |

Hình dạng lược đồ (`schemas/task_breakdown.schema.json`):
- Bắt buộc cấp cao nhất: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Bắt buộc cho mỗi bước: `id`, `title`, `goal`, `verification`, `validation`
- Không bắt buộc cho mỗi bước: `depends_on`

## 📎 Ví dụ

### Duy trì và tái sử dụng một phiên qua nhiều lần chạy

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Chỉ lưu thông điệp trợ lý cuối cùng

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Tạo artifact JSON kế hoạch nhiệm vụ

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## 📚 Tài liệu

- `docs/idea.md`: tầm nhìn sản phẩm cho tác nhân phát triển ứng dụng chạy bởi Codex
- `docs/codex-sdk.md`: ghi chú cài đặt và sử dụng Codex SDK



## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
