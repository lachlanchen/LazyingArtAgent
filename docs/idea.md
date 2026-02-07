# Idea: Codex-Powered App Development Agent

## Summary
Build an automated app development system that can plan and orchestrate the creation of a complete product across iOS, Android, and PWA, plus a shared backend. The system should decompose large goals into small, verifiable tasks and use Codex as the execution engine for planning and coding.

## Goals
- Turn high-level product requirements into a verified task plan.
- Keep tasks small, testable, and easy to validate.
- Support multi-platform delivery (iOS, Android, PWA) with a shared backend.
- Enable repeatable, automated execution rather than ad-hoc manual work.

## Non-goals (for now)
- Build the actual app immediately.
- Lock into a specific framework or cloud provider.

## Key Capabilities Needed
- Task intake and requirements clarification.
- Task decomposition into verifiable steps.
- Artifact generation (code, configs, docs).
- Verification and validation at each step.
- Session and state tracking for long-running work.

## Proposed Workflow (High Level)
1. Intake the product idea and constraints.
2. Produce a structured task plan with verification/validation.
3. Execute tasks in order, with checkpoints and rollbacks.
4. Validate that each platform build meets acceptance criteria.
5. Iterate based on feedback and failing checks.

## Notes
- Codex can be used either via non-interactive CLI scripts or via the SDK for deeper orchestration.
- The system should store and reuse session IDs (threads) to maintain context across runs.
