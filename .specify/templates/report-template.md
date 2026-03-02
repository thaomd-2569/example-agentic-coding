---
description: "Feature report template — generates Google Docs-ready plain text output"
usage: "Read spec.md, plan.md, tasks.md from the target spec folder and populate every [PLACEHOLDER]. Output to specs/[###-feature-name]/report.txt"
---

<!--
  ============================================================================
  INSTRUCTIONS FOR AI
  ============================================================================
  Input files to read (all from specs/[###-feature-name]/):
    1. spec.md   → populate Sections I, II, III, IV
    2. plan.md   → populate Section V
    3. tasks.md  → populate Section VI

  For Section VII: scan actual src/ files referenced in tasks.md
  For Section VIII: leave blank — filled in manually after review

  Output: write plain text to specs/[###-feature-name]/report.txt
  Format rules:
    - No markdown syntax in output (no #, *, `, |)
    - Use ═ for major dividers, ─ for section dividers
    - Use ✅ for completed tasks, ⬜ for pending tasks
    - Align columns with spaces where possible
  ============================================================================
-->

════════════════════════════════════════════════════════════════════════
FEATURE REPORT
Branch   : [###-feature-name]
Generated: [YYYY-MM-DD]
════════════════════════════════════════════════════════════════════════


I. OVERVIEW
────────────────────────────────────────────────────────────────────────
Feature Name : [Feature Name from spec.md h1 title]
Branch       : [###-feature-name]
Status       : [Status from spec.md frontmatter]
Created      : [Created date from spec.md frontmatter]
Progress     : [X done]/[Y total] tasks ([Z]% complete)


II. DESCRIPTION
────────────────────────────────────────────────────────────────────────
[Copy the Description section from spec.md verbatim — 2 to 4 sentences]


III. DATA SCHEMA
────────────────────────────────────────────────────────────────────────
[For each entity defined in spec.md Data Schema, render as plain text table]

Entity: [EntityName]

  Property     Type      Constraint                  Example
  ──────────── ───────── ─────────────────────────── ──────────────────
  id           string    Unique, no duplicates        "[example-id]"
  [property]   [type]    [constraint]                 [example]

[Repeat block for each entity — skip this section if no schema defined]


IV. USER STORIES
────────────────────────────────────────────────────────────────────────
[List every User Story from spec.md with its priority and a 1-line summary]

  1. [P1] [User Story 1 Title]
         What  : [1-line description of what user does]
         Verify: [Independent Test sentence from spec.md]

  2. [P2] [User Story 2 Title]
         What  : [1-line description]
         Verify: [Independent Test sentence]

  3. [P3] [User Story 3 Title]
         What  : [1-line description]
         Verify: [Independent Test sentence]

[Add more entries as needed]


V. PLAN SUMMARY
────────────────────────────────────────────────────────────────────────
[Extract from plan.md — summarize key decisions and phases]

Architecture Decisions:
  [For each row in plan.md Architecture Decisions table]
  • [Topic]: [Chosen Approach] — [Rationale]

Tech Stack:
  UI      : [value from plan.md Tech Stack table]
  State   : [value]
  Storage : [value]
  Utils   : [value]

Phases:
  [For each phase in plan.md, one line summary]
  Phase 1 — [Name]: [Goal — done when criteria]
  Phase 2 — [Name]: [Goal — done when criteria]  ⚠️ BLOCKING
  Phase 3 — [Name]: [Goal — done when criteria]
  [Continue for all phases]


VI. TASKS
────────────────────────────────────────────────────────────────────────
Total Progress: [X done]/[Y total] tasks ([Z]%)

[For each Phase in tasks.md, render tasks with status icons]

Phase [N] — [Phase Name]
  [✅ or ⬜] [T###] [task description]
  [✅ or ⬜] [T###] [task description]

[Repeat for every phase — use ✅ for - [x] and ⬜ for - [ ]]


VII. IMPLEMENTATION
────────────────────────────────────────────────────────────────────────
Files created / modified in this feature:

  New files:
    + [src/path/to/new-file.ts]          [what it contains]
    + [src/path/to/new-component.tsx]    [what it renders]

  Modified files:
    ~ [src/path/to/existing.ts]          [what changed]
    ~ [src/path/to/existing.tsx]         [what changed]

Key implementation notes:
  • [Notable technical decision made during implementation]
  • [Any deviation from plan.md and reason why]
  • [Any known limitations or tech debt introduced]


VIII. NOTES / OPEN QUESTIONS
────────────────────────────────────────────────────────────────────────
(Fill in manually after review)

  1.
  2.
  3.

════════════════════════════════════════════════════════════════════════
END OF REPORT — [###-feature-name]
════════════════════════════════════════════════════════════════════════
