#!/usr/bin/env node

import { execFile, spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type Options = {
  resumeLast: boolean;
  sessionId?: string;
  sessionFile?: string;
  sessionMode: "auto" | "new" | "resume";
  skipGitCheck: boolean;
  json: boolean;
  outputLastMessage?: string;
  prompt?: string;
};

function usage(): void {
  const text = `Usage: codex_analyze_ls.ts [options]

Runs ls -la, then asks Codex to analyze the listing.

Options:
  --resume-last               Resume the most recent exec session
  --session <id>              Resume a specific exec session
  --session-file <path>       Persist a session ID and reuse it
  --session-mode <mode>       Session mode: auto, new, or resume (default: auto)
  --skip-git-check            Allow running outside a Git repo
  --json                      Emit JSONL events instead of formatted text
  --output-last-message <p>   Write the final assistant message to a file
  --prompt <text>             Custom prompt prefix (listing is appended)
  -h, --help                  Show help
`;
  console.log(text);
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    resumeLast: false,
    skipGitCheck: false,
    json: false,
    sessionMode: "auto",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--resume-last":
        options.resumeLast = true;
        break;
      case "--session": {
        const value = argv[i + 1];
        if (!value) {
          throw new Error("--session requires a value");
        }
        options.sessionId = value;
        i += 1;
        break;
      }
      case "--session-file": {
        const value = argv[i + 1];
        if (!value) {
          throw new Error("--session-file requires a value");
        }
        options.sessionFile = value;
        i += 1;
        break;
      }
      case "--session-mode": {
        const value = argv[i + 1];
        if (!value) {
          throw new Error("--session-mode requires a value");
        }
        if (value !== "auto" && value !== "new" && value !== "resume") {
          throw new Error(
            `Invalid --session-mode: ${value} (expected auto, new, or resume)`
          );
        }
        options.sessionMode = value;
        i += 1;
        break;
      }
      case "--skip-git-check":
        options.skipGitCheck = true;
        break;
      case "--json":
        options.json = true;
        break;
      case "--output-last-message": {
        const value = argv[i + 1];
        if (!value) {
          throw new Error("--output-last-message requires a value");
        }
        options.outputLastMessage = value;
        i += 1;
        break;
      }
      case "--prompt": {
        const value = argv[i + 1];
        if (!value) {
          throw new Error("--prompt requires a value");
        }
        options.prompt = value;
        i += 1;
        break;
      }
      case "-h":
      case "--help":
        usage();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (options.resumeLast && options.sessionId) {
    throw new Error("Choose only one of --resume-last or --session");
  }
  if (options.sessionFile && (options.resumeLast || options.sessionId)) {
    throw new Error(
      "Choose only one of --session-file or --resume-last/--session"
    );
  }
  if (options.sessionMode === "new" && (options.resumeLast || options.sessionId)) {
    throw new Error(
      "--session-mode new cannot be combined with --resume-last or --session"
    );
  }
  if (
    options.sessionMode === "resume" &&
    !options.resumeLast &&
    !options.sessionId &&
    !options.sessionFile
  ) {
    throw new Error(
      "--session-mode resume requires --session-file, --session, or --resume-last"
    );
  }

  return options;
}

async function assertGitRepo(skipGitCheck: boolean): Promise<void> {
  if (skipGitCheck) {
    return;
  }
  try {
    await execFileAsync("git", ["rev-parse", "--is-inside-work-tree"]);
  } catch {
    throw new Error(
      "Not inside a Git repo. Re-run with --skip-git-check if this is intentional."
    );
  }
}

async function readSessionFile(path: string): Promise<string | undefined> {
  try {
    const content = await readFile(path, "utf8");
    const trimmed = content.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  } catch (err) {
    const error = err as NodeJS.ErrnoException;
    if (error.code === "ENOENT") {
      return undefined;
    }
    throw err;
  }
}

function parseJsonLine(line: string): unknown | undefined {
  const cleaned = line.endsWith("\r") ? line.slice(0, -1) : line;
  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    return undefined;
  }
}

type CaptureState = {
  threadId?: string;
  deltas: string[];
  fallback: string[];
  sawDelta: boolean;
};

function addFallback(state: CaptureState, text: unknown): void {
  if (typeof text === "string" && text.length > 0) {
    state.fallback.push(text);
  }
}

function maybeSetThreadId(state: CaptureState, obj: unknown): void {
  if (state.threadId || typeof obj !== "object" || obj === null) {
    return;
  }
  const record = obj as Record<string, unknown>;
  const direct = record.thread_id ?? record.session_id;
  if (typeof direct === "string") {
    state.threadId = direct;
    return;
  }
  const thread = record.thread;
  if (typeof thread === "object" && thread !== null) {
    const threadRecord = thread as Record<string, unknown>;
    if (typeof threadRecord.id === "string") {
      state.threadId = threadRecord.id;
    }
  }
}

function collectOutputText(state: CaptureState, obj: unknown): void {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  const record = obj as Record<string, unknown>;
  const type = typeof record.type === "string" ? record.type : "";

  const delta = record.delta;
  if (typeof delta === "string" && type.includes("output_text")) {
    state.deltas.push(delta);
    state.sawDelta = true;
  }

  const text = record.text;
  if (typeof text === "string") {
    if (type.includes("output_text") && type.includes("delta")) {
      state.deltas.push(text);
      state.sawDelta = true;
    } else if (type.includes("output_text")) {
      addFallback(state, text);
    }
  }

  const message = record.message;
  if (typeof message === "object" && message !== null) {
    const content = (message as Record<string, unknown>).content;
    if (Array.isArray(content)) {
      for (const item of content) {
        if (typeof item === "object" && item !== null) {
          const entry = item as Record<string, unknown>;
          if (entry.type === "output_text") {
            addFallback(state, entry.text);
          }
        }
      }
    }
  }

  const output = record.output;
  if (Array.isArray(output)) {
    for (const item of output) {
      if (typeof item === "object" && item !== null) {
        const entry = item as Record<string, unknown>;
        if (entry.type === "output_text") {
          addFallback(state, entry.text);
        }
      }
    }
  }

  const response = record.response;
  if (typeof response === "object" && response !== null) {
    const responseRecord = response as Record<string, unknown>;
    const outputText = responseRecord.output_text;
    if (typeof outputText === "string") {
      addFallback(state, outputText);
    } else if (Array.isArray(outputText)) {
      for (const item of outputText) {
        addFallback(state, item);
      }
    }
    const responseOutput = responseRecord.output;
    if (Array.isArray(responseOutput)) {
      for (const item of responseOutput) {
        if (typeof item === "object" && item !== null) {
          const entry = item as Record<string, unknown>;
          if (entry.type === "output_text") {
            addFallback(state, entry.text);
          }
        }
      }
    }
  }
}

async function runCodexAndCapture(
  args: string[],
  prompt: string,
  echoJson: boolean
): Promise<{ exitCode: number; threadId?: string; outputText: string }> {
  return new Promise((resolve) => {
    const child = spawn("codex", args, { stdio: ["pipe", "pipe", "inherit"] });
    let remainder = "";
    const state: CaptureState = {
      deltas: [],
      fallback: [],
      sawDelta: false,
    };

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      remainder += chunk;
      let index = remainder.indexOf("\n");
      while (index >= 0) {
        const line = remainder.slice(0, index);
        remainder = remainder.slice(index + 1);
        if (echoJson) {
          process.stdout.write(`${line}\n`);
        }
        const parsed = parseJsonLine(line);
        if (parsed !== undefined) {
          maybeSetThreadId(state, parsed);
          collectOutputText(state, parsed);
        }
        index = remainder.indexOf("\n");
      }
    });

    child.stdout.on("end", () => {
      if (remainder.length > 0) {
        if (echoJson) {
          process.stdout.write(remainder);
        }
        const parsed = parseJsonLine(remainder);
        if (parsed !== undefined) {
          maybeSetThreadId(state, parsed);
          collectOutputText(state, parsed);
        }
      }
    });

    child.stdin.write(prompt);
    child.stdin.end();

    child.on("close", (code) => {
      const outputText = state.sawDelta
        ? state.deltas.join("")
        : state.fallback.join("\n\n");
      resolve({
        exitCode: code ?? 0,
        threadId: state.threadId,
        outputText,
      });
    });
  });
}

async function runWithJsonCapture(
  argsBase: string[],
  prompt: string,
  options: Options,
  allowOutputLast: boolean
): Promise<{ exitCode: number; threadId?: string; outputText: string }> {
  let tempDir: string | undefined;
  let outputPath = options.outputLastMessage;
  if (!outputPath && allowOutputLast) {
    tempDir = await mkdtemp(join(tmpdir(), "codex-session-"));
    outputPath = join(tempDir, "last_message.txt");
  }

  const args = [...argsBase];
  if (allowOutputLast) {
    args.push("--json", "--output-last-message", outputPath!, "-");
  } else {
    args.push("--json", "-");
  }

  const result = await runCodexAndCapture(args, prompt, options.json);

  if (!options.json) {
    if (allowOutputLast && outputPath) {
      const message = await readFile(outputPath, "utf8");
      process.stdout.write(message);
    } else if (result.outputText.length > 0) {
      process.stdout.write(result.outputText);
    }
  }

  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
  }

  return result;
}

function printSessionId(sessionId: string): void {
  console.error(`Session ID: ${sessionId}`);
}

async function main(): Promise<void> {
  let options: Options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    usage();
    process.exit(1);
    return;
  }

  await assertGitRepo(options.skipGitCheck);

  const lsResult = await execFileAsync("ls", ["-la"], { encoding: "utf8" });
  const listing = lsResult.stdout;
  const prompt = options.prompt
    ? `${options.prompt}\n\n${listing}`
    : `Analyze this directory listing and summarize anything notable:\n\n${listing}`;

  let sessionId = options.sessionId;
  if (options.sessionFile && options.sessionMode !== "new") {
    const fromFile = await readSessionFile(options.sessionFile);
    if (fromFile) {
      sessionId = fromFile;
    } else if (options.sessionMode === "resume") {
      throw new Error(
        `Session file is empty or missing: ${options.sessionFile}`
      );
    }
  }

  const argsBase: string[] = ["exec"];
  if (options.skipGitCheck) {
    argsBase.push("--skip-git-repo-check");
  }

  let needCapture = false;

  if (options.sessionMode === "new") {
    needCapture = true;
  } else if (options.resumeLast) {
    argsBase.push("resume", "--last");
    needCapture = true;
  } else if (sessionId) {
    argsBase.push("resume", sessionId);
  } else {
    needCapture = true;
  }

  if (needCapture) {
    const allowOutputLast = !argsBase.includes("resume");
    const { exitCode, threadId } = await runWithJsonCapture(
      argsBase,
      prompt,
      options,
      allowOutputLast
    );

    if (!threadId) {
      throw new Error("Failed to capture session ID from JSON output.");
    }

    if (options.sessionFile) {
      await writeFile(options.sessionFile, `${threadId}\n`, "utf8");
    }

    printSessionId(threadId);
    process.exit(exitCode);
    return;
  }

  if (sessionId) {
    printSessionId(sessionId);
  }

  if (options.json) {
    argsBase.push("--json");
  }
  if (options.outputLastMessage) {
    argsBase.push("--output-last-message", options.outputLastMessage);
  }

  argsBase.push("-");

  const child = spawn("codex", argsBase, {
    stdio: ["pipe", "inherit", "inherit"],
  });
  child.stdin.write(prompt);
  child.stdin.end();

  const exitCode: number = await new Promise((resolve) => {
    child.on("close", (code) => resolve(code ?? 0));
  });

  process.exit(exitCode);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
