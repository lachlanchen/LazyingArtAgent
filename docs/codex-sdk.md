# Codex SDK (TypeScript)

## Overview
The Codex SDK lets you control Codex programmatically (threads, resumable runs) from Node.js. It is intended for server-side use.

## Prereqs
- Node.js 18 or later
- npm

## Install

```bash
npm install @openai/codex-sdk
```

## Basic Usage

```ts
import { Codex } from "@openai/codex-sdk";

const codex = new Codex();
const thread = codex.startThread();

const result = await thread.run("Make a plan to diagnose and fix the CI failures");
console.log(result);

// Continue on the same thread
const result2 = await thread.run("Implement the plan");
console.log(result2);

// Resume a past thread
const threadId = "<thread-id>";
const thread3 = codex.resumeThread(threadId);
const result3 = await thread3.run("Pick up where you left off");
console.log(result3);
```
