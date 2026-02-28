[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


# Codex Exec Helpers (LazyingArtAgent)

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Status](https://img.shields.io/badge/status-codex%20cli%20helpers-informational)
![Codex SDK](https://img.shields.io/badge/@openai/codex--sdk-%5E0.98.0-10a37f)

> Các script này chạy `ls -la`, sau đó yêu cầu Codex phân tích danh sách đó.

## Tổng quan

Kho này cung cấp các tiện ích CLI thực dụng cho workflow dùng Codex:
- Phân tích danh sách thư mục hiện tại bằng Codex qua Bash hoặc TypeScript.
- Lưu và tiếp tục lại các phiên `codex exec` giữa nhiều lần chạy.
- Chia tác vụ lớn thành các bước JSON nhỏ, có thể kiểm chứng, và được ràng buộc bằng schema.

Kho cũng bao gồm tầm nhìn sản phẩm ban đầu và ghi chú SDK cho một tác nhân phát triển rộng hơn dựa trên Codex.

### Nhìn nhanh

| Khu vực | Bạn nhận được gì |
|---|---|
| 🔁 Duy trì phiên làm việc | Tiếp tục phiên gần nhất, chỉ định session ID rõ ràng, hoặc dùng file phiên bền vững |
| 📤 Xử lý đầu ra | Chế độ stream JSONL và xuất thông điệp cuối cùng |
| 🧩 Lập kế hoạch có cấu trúc | Workflow tách tác vụ theo JSON schema |
| 🛠️ Hai cách triển khai | Entry point Shell và TypeScript cho phân tích listing |
| 📚 Ghi chú dự án | Tầm nhìn sản phẩm + ghi chú Codex SDK trong `docs/` |

## Tính năng

- Chạy Codex có nhận biết phiên:
  - `--resume-last`
  - `--session <id>`
  - `--session-file <path>`
  - `--session-mode auto|new|resume`
- Kiểm soát đầu ra:
  - `--json` truyền thẳng luồng sự kiện JSONL
  - `--output-last-message <path>`
  - `--prompt <text>` tiền tố prompt tùy chỉnh
- Script lập kế hoạch tác vụ có ép schema:
  - `--task` hoặc `--file`
  - `--schema` ghi đè schema
  - `--out` file đầu ra
- Có cả entrypoint shell và TypeScript để phân tích listing.

## Cấu trúc dự án

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

## Hành vi phiên

`codex exec` sẽ bắt đầu một phiên không tương tác mới trừ khi bạn chủ động tiếp tục phiên cũ. Để tiếp tục phiên trước, dùng `codex exec resume --last` hoặc `codex exec resume <SESSION_ID>`. Bạn có thể tìm session ID qua bộ chọn tương tác `codex resume`, lệnh `/status` bên trong một phiên, hoặc trong `~/.codex/sessions/`.

Các script này cũng hỗ trợ `--session-file <path>` để lưu session ID. Ở lần chạy đầu, script tạo phiên mới, lưu ID, rồi tái sử dụng ở các lần chạy sau.

Bạn có thể điều khiển hành vi phiên bằng `--session-mode`:
- `auto` (mặc định): tiếp tục nếu có session file, nếu không thì tạo phiên mới
- `new`: luôn tạo phiên mới (ghi đè session file nếu có cung cấp)
- `resume`: yêu cầu phải có phiên hiện có (từ `--session-file`, `--session`, hoặc `--resume-last`)

## Điều kiện tiên quyết

| Yêu cầu | Lý do cần thiết |
|---|---|
| `codex` CLI trong `PATH` | Bắt buộc cho mọi script helper |
| Ngữ cảnh kho Git (hoặc `--skip-git-check`) | Script có lớp bảo vệ để tránh chạy nhầm ngoài repo |
| `python3` (hoặc `python`) cho `scripts/codex_analyze_ls.sh` | Cần để parse JSON khi khởi tạo/thu thập đầu ra phiên |
| Node.js 18+ cho `scripts/codex_analyze_ls.ts` | Runtime khuyến nghị cho entrypoint TypeScript |

## Cài đặt

1. Clone repository.
2. Cài dependencies của Node:

```bash
npm install
```

3. Đảm bảo `codex` CLI đã được cài và dùng được:

```bash
codex --help
```

4. Tùy chọn: khởi tạo submodule nếu bạn muốn truy cập cục bộ `vendor/codex`:

```bash
git submodule update --init --recursive
```

Lưu ý: `.gitmodules` khai báo `vendor/codex`, nhưng trong một số bản checkout có thể chưa được khởi tạo.

## Cách dùng

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

### Script Tách tác vụ

Chia tác vụ lớn thành các bước nhỏ có thể kiểm chứng và xuất JSON:

```bash
scripts/codex_task_breakdown.sh --task "Build a login screen" --skip-git-check
```

Dùng file tác vụ và lưu đầu ra:

```bash
scripts/codex_task_breakdown.sh --file docs/task.txt --out outputs/plan.json --skip-git-check
```

Xác thực với đường dẫn schema tùy chỉnh:

```bash
scripts/codex_task_breakdown.sh --task "Refactor auth flow" --schema schemas/task_breakdown.schema.json --skip-git-check
```

### Script Node TypeScript: Phân tích `ls -la`

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

## Cấu hình

### `scripts/codex_analyze_ls.sh` và `scripts/codex_analyze_ls.ts`

| Tùy chọn | Mô tả |
|---|---|
| `--resume-last` | Tiếp tục phiên exec gần nhất |
| `--session <id>` | Tiếp tục một phiên exec cụ thể |
| `--session-file <path>` | Lưu và tái sử dụng session ID |
| `--session-mode <auto|new|resume>` | Chiến lược phiên tường minh |
| `--skip-git-check` | Bỏ qua kiểm tra kho Git |
| `--json` | Xuất sự kiện JSONL |
| `--output-last-message <path>` | Ghi thông điệp trợ lý cuối cùng |
| `--prompt <text>` | Tiền tố prompt tùy chỉnh trước listing được nối vào |

Các quy tắc ràng buộc được cả hai script phân tích áp dụng:
- `--resume-last` và `--session` loại trừ lẫn nhau.
- `--session-file` không thể kết hợp với `--resume-last` hoặc `--session`.
- `--session-mode new` không thể kết hợp với cờ resume tường minh.
- `--session-mode resume` yêu cầu `--session-file`, `--session`, hoặc `--resume-last`.

### `scripts/codex_task_breakdown.sh`

| Tùy chọn | Mô tả |
|---|---|
| `--task <text>` | Tác vụ inline |
| `--file <path>` | Đọc nội dung tác vụ từ file |
| `--schema <path>` | File schema (mặc định: `schemas/task_breakdown.schema.json`) |
| `--out <path>` | Ghi JSON cuối cùng ra file |
| `--skip-git-check` | Bỏ qua kiểm tra kho Git |

Hình dạng schema (`schemas/task_breakdown.schema.json`):
- Bắt buộc ở cấp cao nhất: `task_summary`, `assumptions`, `steps`, `risks`, `out_of_scope`
- Bắt buộc cho mỗi bước: `id`, `title`, `goal`, `verification`, `validation`
- Tùy chọn cho mỗi bước: `depends_on`

## Ví dụ

### Lưu và tái sử dụng một phiên qua nhiều lần chạy

```bash
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
scripts/codex_analyze_ls.sh --session-file .codex_session --skip-git-check
```

### Chỉ lưu thông điệp trợ lý cuối cùng

```bash
scripts/codex_analyze_ls.sh --output-last-message outputs/last.txt --skip-git-check
```

### Tạo artifact JSON kế hoạch tác vụ

```bash
scripts/codex_task_breakdown.sh \
  --task "Implement JWT auth with refresh token rotation" \
  --out outputs/auth-plan.json \
  --skip-git-check
```

## Tài liệu

- `docs/idea.md`: tầm nhìn sản phẩm cho tác nhân phát triển ứng dụng chạy bằng Codex
- `docs/codex-sdk.md`: ghi chú cài đặt và sử dụng Codex SDK

## Ghi chú phát triển

- Cả hai script phân tích đều gửi prompt tới `codex` qua stdin (`-`), giúp tránh lỗi shell-quoting.
- Cả hai script đều in `Session ID: ...` ra stderr để không ảnh hưởng stdout.
- Script shell dùng `python3` (hoặc `python`) để parse JSONL khi khởi tạo session file.
- Nếu cần kiểm soát theo chương trình sâu hơn (threads, workflow có thể tiếp tục), hãy cân nhắc Codex SDK và lưu thread ID giữa các lần chạy.
- `npx tsx ...` được ghi nhận để chạy script TypeScript; `tsx` hiện chưa được khai báo trong `package.json` (cài global hoặc chạy qua `npx`).

## Khắc phục sự cố

| Triệu chứng | Nguyên nhân có thể | Cách xử lý |
|---|---|---|
| `codex CLI not found in PATH` | Codex CLI chưa được cài hoặc không thể tìm thấy | Cài Codex CLI và kiểm tra bằng `codex --help`. |
| `Not inside a Git repo` | Lớp bảo vệ của script đã chặn thực thi | Chạy bên trong repository hoặc thêm `--skip-git-check`. |
| `Session file is empty or missing` với `--session-mode resume` | Chế độ resume yêu cầu nguồn ID đã tồn tại | Tạo/khởi tạo session file trước (ví dụ với `--session-mode auto` hoặc `--session-mode new`). |
| `python3 or python is required` (đường dẫn script shell) | Thiếu Python để parse JSONL | Cài Python rồi thử lại. |
| Lỗi `npx tsx` | Phụ thuộc runtime chưa có cục bộ | Dùng trực tiếp `npx tsx ...`, hoặc thêm `tsx` làm dev dependency cục bộ. |

## Lộ trình

- Thêm các file README đa ngôn ngữ được tạo trong `i18n/` và giữ đồng bộ điều hướng ngôn ngữ.
- Thêm các alias npm script cho các luồng phổ biến (`analyze:sh`, `analyze:ts`, `plan:task`).
- Thêm kiểm tra CI nhẹ cho lint shell script và ví dụ xác thực schema.
- Mở rộng ví dụ task planner với template thực tế trong `docs/`.

## Đóng góp

Mọi đóng góp đều được chào đón.

Quy trình được đề xuất:
1. Tạo feature branch.
2. Giữ thay đổi tập trung và đúng với thực tế repository.
3. Cập nhật docs/ví dụ khi hành vi CLI thay đổi.
4. Mở pull request mô tả thay đổi hành vi và các bước xác thực.

## Giấy phép

Metadata của package khai báo giấy phép `ISC` trong `package.json`.

Lưu ý: tại thời điểm viết, bản checkout này chưa có file `LICENSE` độc lập.
