---
trigger: always_on
---

---
trigger: always_on
---

# AGENTS.md

## Purpose

This document defines the standard development guidelines for AI agents working on this project. Follow these instructions unless the project contains more specific documentation that overrides them.

---

# Before Making Changes

* Understand the existing codebase before making modifications.
* **Always use `CLAUDE.md` as the primary reference document for the project's tech stack, architecture, and development standards.**
* Read any additional project-specific documentation (README.md, CONTRIBUTING.md, project docs, etc.) if available.
* Follow the workflow orchestration principles defined below for every command or task execution.
* Follow the existing architecture and coding patterns.
* Prefer consistency with the current implementation over introducing new patterns.

---

# Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
- If something goes sideways, STOP and re-plan immediately - don't keep pushing.
- Use plan mode for verification steps, not just building.
- Write detailed specs upfront to reduce ambiguity.
- Note: Antigravity automatically tracks tasks, so there is no need to manually create or maintain a `tasks/todo.md` file - rely on the built-in task tracking instead.

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, throw more compute at it via subagents.
- One task per subagent for focused execution.

### 3. Self-Improvement Loop
- After ANY correction from the user, internalize the pattern and apply it for the rest of the session so the same mistake isn't repeated.
- Ruthlessly iterate until mistake rate drops.

### 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness.

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution."
- Skip this for simple, obvious fixes - don't over-engineer.
- Challenge your own work before presenting it.

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests - then resolve them.
- Zero context switching required from the user.
- Go fix failing CI tests without being told how.

### Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

# Code Quality

* Keep changes minimal and focused.
* Avoid modifying unrelated code.
* Write clean, readable, and maintainable code.
* Remove unused code, imports, and variables when appropriate.
* Avoid unnecessary dependencies.
* Reuse existing utilities and components whenever possible.

---

# Project Structure

* Follow the existing folder structure.
* Place new files in the most appropriate location.
* Use existing naming conventions for files, functions, variables, and components.

---

# Imports

* Prefer project path aliases (such as `@/`) when configured.
* Keep imports organized.
* Remove unused imports.

---

# Type Safety

* Maintain strong type safety.
* Avoid using `any` unless absolutely necessary.
* Reuse existing types before creating new ones.
* Keep TypeScript errors at zero whenever possible.

---

# Error Handling

* Handle expected failures gracefully.
* Use meaningful error messages.
* Do not silently ignore errors.

---

# Performance

* Avoid unnecessary re-renders.
* Avoid duplicate API calls.
* Reuse cached or existing data where appropriate.
* Consider performance when introducing new logic.

---

# Security

* Never expose secrets or credentials.
* Never hardcode API keys or passwords.
* Validate user input where applicable.
* Follow existing authentication and authorization patterns.

---

# Package Manager

* **This project uses `pnpm` exclusively.**
* **Always use `pnpm` commands. Never use `npm`, `yarn`, or any other package manager in commands or documentation.**

---

# Terminal Commands

* **Antigravity may execute commands using PowerShell.**
* **To ensure compatibility, every terminal command must start with `cmd /c`.**

Examples:

* `cmd /c pnpm install`
* `cmd /c pnpm dev`
* `cmd /c pnpm build`

---

# Testing

Before considering a task complete:

* Ensure the project builds successfully if applicable.
* Resolve any TypeScript errors introduced by the change.
* Resolve linting issues introduced by the change.
* Verify that existing functionality is not broken.

---

# Documentation

When behavior changes:

* Update relevant documentation if needed.
* Keep comments concise and only where they add value.

---

# Communication

After completing a task, provide:

1. A brief summary of what was changed.
2. Any assumptions or important notes.
3. Any follow-up work that may be recommended.

---

# Git Commit Message

At the end of every completed request, always provide a short, concise Git commit message summarizing the implemented change.

Use conventional commit prefixes when appropriate, for example:

* feat:
* fix:
* refactor:
* docs:
* chore:
* perf:
* style:
* test: