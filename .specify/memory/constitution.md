<!--
SYNC IMPACT REPORT
==================
Version change: (template) -> 1.0.0
Added sections:
  - Core Principles (5 principles)
  - UI Technology Stack
  - Development Workflow
  - Governance
Modified principles: N/A (initial ratification)
Removed sections: N/A
Templates requiring updates:
  CHECK .specify/memory/constitution.md -- this file
  WARN  .specify/templates/plan-template.md -- verify Constitution Check references Tailwind/Lucide rules
  WARN  .specify/templates/spec-template.md -- ensure UI requirements section references these standards
  WARN  .specify/templates/tasks-template.md -- add task types: ui-styling, icon-usage
Deferred TODOs: none
-->

# Example Agentic Coding Constitution

## Core Principles

### I. Utility-First Styling with Tailwind CSS v4 (NON-NEGOTIABLE)

All UI styling MUST use Tailwind CSS v4 utility classes directly in markup.
Custom CSS is forbidden unless no utility class combination can achieve the requirement.

- Configuration MUST use the CSS-based `@theme` directive. JavaScript config files
  (`tailwind.config.js`) are deprecated in v4 and MUST NOT be used for new code.
- Import Tailwind in the root CSS file with `@import "tailwindcss"`.
- Custom design tokens MUST be defined as CSS variables inside `@theme { }`:
  ```css
  @theme {
    --color-brand: oklch(0.55 0.22 250);
    --font-sans: "Inter", sans-serif;
  }
  ```
- Custom reusable utilities MUST use the `@utility` directive (NOT `@layer components`):
  ```css
  @utility btn-primary {
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--color-brand);
  }
  ```
- Dynamic values driven by props MUST use CSS custom properties via inline styles:
  ```jsx
  <button style={{ "--bg": color }} className="bg-(--bg)">...</button>
  ```
- Prettier plugin `prettier-plugin-tailwindcss` MUST be configured to enforce canonical class order.
- Dark mode MUST use the `dark:` variant; never use separate style sheets for theming.

**Rationale**: v4 CSS-first approach removes the JS config layer, reduces build complexity,
and makes design tokens inspectable in DevTools without additional tooling.

### II. Named Icon Imports with Lucide React

All icons MUST be imported as named exports from `lucide-react`. Wildcard imports are forbidden.

```jsx
// CORRECT
import { Camera, Check, AlertCircle } from 'lucide-react';

// FORBIDDEN -- kills tree-shaking, bloats bundle
import * as icons from 'lucide-react';
```

- Size and color MUST be controlled via props (`size`, `color`, `strokeWidth`), not CSS overrides,
  unless integrating with Tailwind sizing utilities via `className`.
- Decorative icons (purely visual) require no extra attributes -- Lucide defaults to `aria-hidden="true"`.
- Meaningful icons (convey information without adjacent text) MUST include `aria-label`:
  ```jsx
  <Check aria-label="Task completed" />
  ```
- `DynamicIcon` from `lucide-react/dynamic` is permitted ONLY for CMS-driven or
  database-driven icon names; static usage MUST always use direct named imports.
- Do NOT install `lucide-react-native` in web projects; keep packages scoped to their target runtime.

**Rationale**: Named imports enable tree-shaking, keeping the JS bundle minimal. Accessibility
attributes ensure icons are usable with assistive technologies without extra work.

### III. MCP-Assisted Development

Agents and developers MUST use the configured MCP servers to look up library documentation
before implementing features that depend on external libraries.

- Context7 (`@upstash/context7-mcp`) is the primary documentation source. Invoke it by
  appending `use context7` to any library-related query in Copilot Chat (Agent mode).
- Documentation retrieved via Context7 takes precedence over model training knowledge for
  version-specific APIs (e.g., Tailwind v4 `@theme` vs v3 `tailwind.config.js`).
- When adding a new dependency, an agent MUST verify the current API via Context7 before
  generating implementation code.
- MCP server configuration lives in `.vscode/mcp.json` and MUST be kept in version control.
  Secrets (tokens) MUST use environment variable references, never hardcoded values.

**Rationale**: Model training data becomes stale. MCP-assisted lookup ensures generated code
reflects the library's current API, reducing bugs from outdated patterns.

### IV. Component-First Architecture

UI MUST be decomposed into small, reusable React components. No component file should exceed
200 lines of JSX/TSX without a justification comment.

- Each component MUST have a single, clearly named responsibility.
- Styling MUST live alongside the component (co-located) via Tailwind classes, not in
  separate `.css` or `.module.css` files.
- Shared compound utilities (e.g., card, badge) MUST be extracted to `@utility` in the
  global CSS file, not duplicated across components.
- Components receiving `className` as a prop MUST merge it safely (e.g., using `clsx` or `cn`).

**Rationale**: Co-located styling and small components reduce context-switching, make
refactoring safer, and keep Tailwind's JIT scanner accurate.

### V. Simplicity and YAGNI

Every addition MUST solve a present, documented requirement. Speculative abstractions,
over-engineering, and premature optimisation are forbidden.

- Prefer the simplest implementation that satisfies the acceptance criteria.
- Remove dead code in the same PR that introduces the replacement.
- Dependencies MUST be justified; avoid packages that duplicate Tailwind CSS or Lucide React
  functionality already available in the project.

**Rationale**: Complexity compounds. Keeping the codebase minimal makes agentic coding
faster, more reliable, and easier to audit.

## UI Technology Stack

| Layer         | Technology                  | Version |
|---------------|-----------------------------|---------|
| Styling       | Tailwind CSS                | v4.x    |
| Icons         | Lucide React                | latest  |
| Framework     | React                       | 18+     |
| Class sorting | prettier-plugin-tailwindcss | latest  |

Upgrading a pinned version requires updating this section and bumping the constitution version
(MINOR if additive, MAJOR if breaking changes to existing principles).

## Development Workflow

1. **Before implementing** any feature touching a library listed above, query Context7 for
   the latest API documentation.
2. **During implementation**, apply Principles I-IV as a self-review checklist.
3. **Before committing**, run Prettier with `prettier-plugin-tailwindcss` to sort classes.
4. **In PR description**, note any deviation from this constitution with explicit justification.

## Governance

This constitution supersedes all other style guides and coding conventions in this repository.

- Amendments require: (a) a documented rationale, (b) version bump following semver rules,
  (c) updating `LAST_AMENDED_DATE`, (d) propagating changes to dependent templates.
- All code review MUST verify compliance with at minimum Principles I and II.
- The constitution is versioned with the repository; proposed changes go through PR review.
- Runtime development guidance for agents is provided in `.specify/` templates and commands.

**Version**: 1.0.0 | **Ratified**: 2026-02-28 | **Last Amended**: 2026-02-28
