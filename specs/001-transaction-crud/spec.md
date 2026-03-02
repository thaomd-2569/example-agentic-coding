# Feature Specification: Transaction CRUD

**Feature Branch**: `001-transaction-crud`
**Created**: 2026-03-01
**Status**: Draft
**Input**: User description: "The system allows users to record their daily income and expenses. Data must be persisted locally so that it remains available after page reloads."

## Description

The system allows users to record their daily income and expenses.
To ensure a seamless static experience, data must be stored locally
(localStorage) so that it remains intact after page reloads.

## Data Schema

Each transaction record (**Transaction**) must be an object with the following properties:

| Property   | Type     | Constraint                       | Example           |
|------------|----------|----------------------------------|-------------------|
| `id`       | string   | Unique, no duplicates            | `"v1st-992j"`     |
| `amount`   | number   | Must be > 0                      | `50000`           |
| `type`     | enum     | `'income'` or `'expense'`        | `'expense'`       |
| `category` | string   | Must not be empty                | `"Food"`          |
| `date`     | string   | ISO 8601 format                  | `"2026-03-01"`    |
| `note`     | string   | Optional                         | `"Morning coffee"` |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a New Transaction (Priority: P1)

A user records a new income or expense transaction by filling out a form with
the required information: amount, type, category, date, and an optional note.

**Why this priority**: Without the ability to create transactions, the system has no
data to display. This is the foundational action of the entire feature.

**Independent Test**: Fill the form with valid data (50,000₫, "expense", "Food",
today) → click Save → the transaction appears at the top of the list with the correct values.

**Acceptance Scenarios**:

1. **Given** a user opens the "Add Transaction" form, **When** they enter a valid amount,
   select a type, select a category, choose a date, and click Save, **Then** the transaction
   is saved to localStorage and immediately appears at the top of the list.
2. **Given** a user enters zero or a negative amount, **When** they click Save,
   **Then** an inline validation error is shown and nothing is persisted.
3. **Given** a user leaves a required field (amount, type, or date) empty,
   **When** they click Save, **Then** the form highlights the empty field and blocks submission.
4. **Given** a user enters a note exceeding 255 characters, **When** they click Save,
   **Then** a character-limit error is shown and the form is not submitted.

---

### User Story 2 - View Transaction List (Priority: P1)

A user views all their recorded transactions sorted newest-first, with VND currency
formatting and colour-coding to distinguish income from expenses.

**Why this priority**: Viewing data is the primary read action. Without it, users cannot
confirm entries were saved correctly or gain any insight from the system.

**Independent Test**: Add 3 transactions with different dates → open the list → confirm
the newest is at the top, expenses show in red with `-`, income shows in green with `+`,
and amounts are formatted as `50,000₫`.

**Acceptance Scenarios**:

1. **Given** a user opens the transaction list, **When** the page loads, **Then**
   transactions are displayed in reverse-chronological order (newest first).
2. **Given** an expense transaction is in the list, **When** displayed,
   **Then** the amount is shown in red with a minus sign (`-50,000₫`).
3. **Given** an income transaction is in the list, **When** displayed,
   **Then** the amount is shown in green with a plus sign (`+50,000₫`).
4. **Given** a user has no transactions, **When** they open the list, **Then** an empty
   state is shown with an illustration and the message:
   "You have no transactions yet. Add your first one!"

---

### User Story 3 - Data Persistence After Page Reload (Priority: P1)

After a user adds transactions and reloads the page (F5), all data remains intact
because it is stored in localStorage.

**Why this priority**: This is the core requirement of the spec — the app is static with
no backend, so localStorage is the single source of truth.

**Independent Test**: Add a transaction → press F5 → the list still shows the transaction
that was just added.

**Acceptance Scenarios**:

1. **Given** a user has added one or more transactions, **When** they reload the page
   (F5), **Then** all previously recorded transactions are still displayed correctly.
2. **Given** a user deletes a transaction and then reloads the page, **When** the page
   finishes loading, **Then** the deleted transaction does not reappear.

---

### User Story 4 - Delete a Transaction (Priority: P2)

A user removes an incorrectly recorded transaction after confirming the action via a
dialog, so that their data remains accurate.

**Why this priority**: Deletion is a permanent destructive action that requires an explicit
confirmation step; ranked P2 because create and read must work first.

**Independent Test**: Click Delete on a transaction → confirm the dialog → the transaction
disappears from the list and is no longer in localStorage.

**Acceptance Scenarios**:

1. **Given** a user clicks Delete on a transaction, **When** a confirmation dialog appears
   and they click Confirm, **Then** the transaction is permanently removed and the list
   updates immediately.
2. **Given** a user clicks Delete, **When** the confirmation dialog appears and they click
   Cancel, **Then** the transaction is not deleted.
3. **Given** a transaction has been deleted, **When** the user reloads the page, **Then**
   the deleted transaction does not reappear in the list.

---

### Edge Cases

- If localStorage is full (quota exceeded) when saving a transaction → a user-friendly
  error message is displayed; existing data must not be partially overwritten.
- If the data in localStorage is corrupt (JSON cannot be parsed) → the app starts with
  an empty list instead of crashing.
- If a user types an amount with a thousands separator (e.g. "50,000") → the form either
  normalises it to a plain integer or shows a clear validation error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow users to create a transaction with: `amount`
  (required, positive number), `type` (required: `income` / `expense`), `category`
  (required, selected from a predefined list), `date` (required, ISO 8601), `note`
  (optional, ≤ 255 characters).
- **FR-002**: The system MUST reject transactions where `amount` is zero, negative, or
  non-numeric, and display a field-level validation error.
- **FR-003**: The system MUST assign a unique `id` to each transaction at creation time.
- **FR-004**: The system MUST display the transaction list ordered by `date` descending
  (newest first).
- **FR-005**: Expense amounts MUST be displayed in red with a minus sign (`-`);
  income amounts MUST be displayed in green with a plus sign (`+`).
- **FR-006**: Amounts MUST be formatted in VND (e.g. `50,000₫`).
- **FR-007**: When there are no transactions, the system MUST display an empty state with
  an illustration and the message: "You have no transactions yet. Add your first one!"
- **FR-008**: The system MUST require explicit confirmation via a dialog before permanently
  deleting a transaction.
- **FR-009**: The system MUST persist all transactions to the browser's localStorage so
  that data survives a full page reload.
- **FR-010**: The transaction form MUST use a Grid layout: 1 column on Mobile, 2 columns
  on Desktop.
- **FR-011**: The amount input field MUST display the "₫" symbol as a fixed suffix.

### Key Entities

- **Transaction**: The core data record. Properties: `id` (string, unique), `amount`
  (number > 0), `type` (`'income'` | `'expense'`), `category` (string), `date`
  (ISO 8601 string), `note` (string, optional).
- **Category**: A classification label for transactions. Predefined by the system;
  users select from the list and cannot create custom categories within this feature scope.

## Implementation Research (MCP Context7)

When entering Plan Mode, the AI MUST use **Context7** to look up the latest documentation
for the following technical topics before producing an implementation plan:

| Topic | What to look up |
|---|---|
| **State persistence** | How to sync Zustand state with localStorage using the `persist` middleware |
| **ID generation** | How to use `crypto.randomUUID()` or the `nanoid` library to generate unique IDs without increasing bundle size |
| **Date formatting** | Latest `date-fns` API: format dates as "Today", "Yesterday", or "01 March" |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a 50,000₫ expense to the "Food" category and see it appear
  at the top of the list within 1 second of clicking Save.
- **SC-002**: After a full page reload (F5), 100% of previously saved transactions are
  still displayed correctly.
- **SC-003**: Clicking Delete and confirming causes the transaction to disappear from both
  the list and localStorage immediately, without a page reload.
- **SC-004**: The transaction form renders a 1-column layout on screens < 768 px and a
  2-column layout on screens ≥ 768 px.
- **SC-005**: The app does not crash when localStorage contains invalid JSON; instead it
  starts with an empty transaction list.

## Acceptance Criteria

- [ ] A user can add a 50,000₫ expense transaction to the "Food" category.
- [ ] The newly added transaction appears immediately at the top of the list.
- [ ] After pressing F5 to reload the browser, the data is still present (localStorage works).
- [ ] Clicking the Delete button removes the transaction from both the list and memory.

## Assumptions

- The app runs entirely in the browser (static); there is no backend or API server.
- Categories are predefined in the app; users cannot add custom categories within this
  feature scope.
- The only supported currency is VND; multi-currency is out of scope.
- User authentication is not required; all data belongs to a single user on that device.
- Only per-row deletion is supported; bulk delete is out of scope.
