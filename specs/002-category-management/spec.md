# Feature Specification: Category Management

**Feature Branch**: `002-category-management`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Users can create, edit, and delete Categories (name, color). Categories are persisted to localStorage, seeded with predefined values on first launch, and cannot be deleted while assigned to existing Transactions."

## Description

The system enables users to manage the set of categories used to classify transactions.
On first launch the app seeds a list of predefined categories so that users can start
recording transactions immediately. Users may add custom categories, rename or recolour
existing ones, and delete categories that are no longer needed — provided those categories
are not currently assigned to any transaction.
All category data is persisted in the browser's localStorage so that it survives a full
page reload.

## Data Schema

Each category record (**Category**) must be an object with the following properties:

| Property  | Type   | Constraint                                  | Example      |
|-----------|--------|---------------------------------------------|--------------|
| `id`      | string | Unique, no duplicates                       | `"cat-001"`  |
| `name`    | string | Required, non-empty, unique (case-insensitive) | `"Food"`  |
| `color`   | string | Optional; hex color code if provided        | `"#FF5733"`  |

### Predefined (Seed) Categories

The following categories are seeded automatically on the **first** app launch
(i.e. when localStorage contains no category data):

| Name          | Color     |
|---------------|-----------|
| Food          | `#F97316` |
| Transport     | `#3B82F6` |
| Entertainment | `#A855F7` |
| Health        | `#EF4444` |
| Shopping      | `#EC4899` |
| Education     | `#14B8A6` |
| Salary        | `#22C55E` |
| Other         | `#6B7280` |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Seed Predefined Categories on First Launch (Priority: P1)

When the app is opened for the first time (no category data in localStorage), the system
automatically populates the category list with a set of predefined categories, so that
users can start assigning categories to transactions immediately without manual setup.

**Why this priority**: Transactions (spec 001) require a category to be selected.
Without seed data the transaction form would be unusable on first launch.

**Independent Test**: Clear localStorage → reload the app → open the category list →
confirm all 8 predefined categories are present with the correct names and colors.

**Acceptance Scenarios**:

1. **Given** localStorage contains no category data, **When** the app loads, **Then**
   all 8 predefined categories are present in the category list with the correct names and colors.
2. **Given** a user has previously added or modified categories, **When** they reload the
   page, **Then** the seed data is NOT re-applied; only the user's existing data is shown.

---

### User Story 2 - Create a New Category (Priority: P1)

A user creates a custom category by entering a unique name and optionally selecting a color.

**Why this priority**: Users may have spending categories that are not covered by the
predefined list. Creating custom categories is the primary way to extend the system.

**Independent Test**: Open the "Add Category" form → enter "Freelance", pick color
`#FBBF24` → click Save → "Freelance" appears in the category list with the correct color.

**Acceptance Scenarios**:

1. **Given** a user opens the "Add Category" form, **When** they enter a unique name and
   click Save, **Then** the category is saved to localStorage and appears immediately in
   the list.
2. **Given** a user enters a name that already exists (case-insensitive), **When** they
   click Save, **Then** an inline validation error is shown and nothing is persisted.
3. **Given** a user leaves the name field empty, **When** they click Save, **Then** the
   form highlights the empty field and blocks submission.
4. **Given** a user does not pick a color, **When** the category is saved, **Then** a
   default color is assigned automatically.

---

### User Story 3 - Edit an Existing Category (Priority: P1)

A user updates the name or color of an existing category.

**Why this priority**: Users' categorization needs evolve over time. Editing ensures the
category list stays accurate without requiring delete-and-recreate workflows.

**Independent Test**: Click Edit on "Other" → change name to "Miscellaneous" and color to
`#9CA3AF` → click Save → the list shows "Miscellaneous" with the new color; all
transactions previously tagged "Other" now display "Miscellaneous".

**Acceptance Scenarios**:

1. **Given** a user clicks Edit on a category, **When** they change the name to a unique
   value and click Save, **Then** the category is updated in the list and in localStorage.
2. **Given** the updated name is the same as another existing category (case-insensitive),
   **When** the user clicks Save, **Then** a validation error is shown and the category
   remains unchanged.
3. **Given** a category is assigned to one or more transactions, **When** the user renames
   it, **Then** all linked transactions reflect the new name immediately.
4. **Given** a user clicks Cancel or closes the edit form without saving, **Then** no
   changes are persisted.

---

### User Story 4 - Delete a Category (Priority: P2)

A user removes a category that is no longer needed, after an explicit confirmation step.
Deletion is blocked if the category is currently assigned to any transaction.

**Why this priority**: Deletion is permanent and potentially destructive; it must not
break existing transaction data. Ranked P2 because create/edit must work first.

**Independent Test (safe delete)**: Add a new category "Test" → do NOT assign it to any
transaction → click Delete → confirm dialog → "Test" disappears from the list and
localStorage.

**Independent Test (blocked delete)**: Assign "Food" to a transaction → click Delete on
"Food" → confirm that a warning is shown and "Food" remains in the list.

**Acceptance Scenarios**:

1. **Given** a user clicks Delete on a category that has **no** assigned transactions,
   **When** a confirmation dialog appears and they click Confirm, **Then** the category is
   permanently removed from the list and from localStorage.
2. **Given** a user clicks Delete on a category that **has** assigned transactions,
   **When** they attempt to confirm, **Then** a warning message is displayed explaining
   that the category is in use, and the deletion is blocked.
3. **Given** a confirmation dialog is open, **When** the user clicks Cancel, **Then** the
   category is not deleted.
4. **Given** a category has been deleted, **When** the user reloads the page, **Then** the
   category does not reappear in the list.

---

### Edge Cases

- If localStorage is full when saving a category → a user-friendly error message is shown;
  existing data must not be partially overwritten.
- If the category data in localStorage is corrupt (JSON cannot be parsed) → the app falls
  back to the predefined seed list instead of crashing.
- If a category name contains leading/trailing whitespace → the system trims it before
  saving and before checking uniqueness.
- If two predefined category names collide with user-created names after a data migration →
  the user-created category takes precedence and the seed is skipped for that name.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On **first** launch (no category data in localStorage), the system MUST
  automatically seed the 8 predefined categories listed in the Data Schema.
- **FR-002**: The system MUST allow users to create a category with: `name` (required,
  non-empty, unique case-insensitive) and `color` (optional hex string).
- **FR-003**: The system MUST assign a unique `id` to each category at creation time.
- **FR-004**: If no color is provided, the system MUST assign a default color to the
  new category.
- **FR-005**: The system MUST reject categories with duplicate names (case-insensitive)
  and display a field-level validation error.
- **FR-006**: The system MUST allow users to edit the `name` and `color` of an existing
  category. All transactions referencing that category MUST reflect the updated name
  immediately.
- **FR-007**: The system MUST require explicit confirmation via a dialog before permanently
  deleting a category.
- **FR-008**: The system MUST block deletion of a category that is currently assigned to
  one or more transactions, and MUST display a descriptive warning message.
- **FR-009**: The system MUST persist all category data to the browser's localStorage so
  that data survives a full page reload.
- **FR-010**: The category list MUST be displayed in alphabetical order by name.
- **FR-011**: The transaction form (spec 001) MUST use the live category list from
  localStorage as the source for its category selector.

### Key Entities

- **Category**: Properties: `id` (string, unique), `name` (string, required, unique
  case-insensitive), `color` (string, optional hex).
- **Transaction** *(from spec 001)*: References a category by `id`. When a category is
  renamed, all transactions' display must reflect the new name.

## Implementation Research (MCP Context7)

When entering Plan Mode, the AI MUST use **Context7** to look up the latest documentation
for the following technical topics before producing an implementation plan:

| Topic | What to look up |
|-------|-----------------|
| **Zustand persist** | How to share and compose multiple Zustand slices that each use `persist` middleware in the same localStorage key |
| **ID generation** | Confirm `crypto.randomUUID()` browser support or `nanoid` for category IDs |
| **Color picker** | Whether a native `<input type="color">` is sufficient or if a lightweight library (e.g. `react-colorful`) is needed for the target browsers |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On first launch, all 8 predefined categories are visible in the category
  list within 500 ms of the page loading, with no user action required.
- **SC-002**: A user can create a new custom category and see it appear in the list within
  1 second of clicking Save.
- **SC-003**: After renaming a category, all transactions previously assigned to it display
  the new name immediately — without a page reload.
- **SC-004**: Clicking Delete on an in-use category shows a blocking warning; the category
  remains in the list and in localStorage.
- **SC-005**: Clicking Delete on an unused category and confirming removes it from the list
  and localStorage immediately, without a page reload.
- **SC-006**: After a full page reload (F5), 100% of user-created and modified categories
  are still present and unchanged.
- **SC-007**: The app does not crash when localStorage contains invalid JSON for categories;
  instead it displays the predefined seed list.

## Acceptance Criteria

- [ ] On first launch, the 8 predefined categories are present in the list automatically.
- [ ] A user can create a category with a unique name and see it in the list immediately.
- [ ] Duplicate category names (case-insensitive) are rejected with a validation error.
- [ ] A user can edit a category name/color and see the changes reflected immediately.
- [ ] Transactions linked to a renamed category display the new name without a reload.
- [ ] Deleting an in-use category is blocked with a descriptive warning.
- [ ] Deleting an unused category (after confirmation) removes it from the list and localStorage.
- [ ] After pressing F5, all category data is still present (localStorage works).

## Assumptions

- Category IDs are generated client-side (no backend required).
- The predefined seed list is hardcoded in the app; it is not configurable by the user
  within this feature scope.
- Users cannot merge two categories; that is out of scope for this feature.
- There is no maximum limit on the number of user-created categories within this feature
  scope.
- The only supported color format is a valid 6-digit hex string (`#RRGGBB`); other formats
  (HSL, RGB, named colors) are out of scope.
- Category data is stored in the same localStorage namespace as transactions but under a
  separate key (e.g. `categories`).
