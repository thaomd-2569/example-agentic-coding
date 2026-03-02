# Feature Specification: CSV Export for Transactions

**Feature Branch**: `005-csv-export`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Export toàn bộ hoặc filtered Transaction list ra file CSV. Columns: Date, Type, Category, Amount (VND), Note. Tên file theo format: transactions_YYYY-MM-DD.csv. Không cần backend, dùng Blob API để download trực tiếp trên browser. Hiển thị toast thông báo export thành công. Nếu không có transaction nào → disable nút Export + tooltip giải thích. Implementation Research: dùng Context7 tra cứu cách tạo CSV với Blob API."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Export Transactions to CSV (Priority: P1)

As a user, I want to export the current (filtered or full) transaction list to a CSV file with the correct columns and filename format, so I can analyze or share my data externally.

**Why this priority**: Exporting data is a core value for users who want to back up, analyze, or share their transactions outside the app.

**Independent Test**: Can be fully tested by clicking Export and verifying the downloaded CSV file contains the correct data, columns, and filename.

**Acceptance Scenarios**:
1. **Given** transactions are present (filtered or full), **When** the user clicks Export, **Then** a CSV file named transactions_YYYY-MM-DD.csv is downloaded with columns: Date, Type, Category, Amount (VND), Note.
2. **Given** the export is successful, **When** the file is downloaded, **Then** a toast notification appears confirming success.

---

### User Story 2 - Export Button Disabled When No Data (Priority: P2)

As a user, I want the Export button to be disabled with an explanation when there are no transactions to export, so I am not confused by an unavailable action.

**Why this priority**: Prevents user frustration and clarifies why export is not possible.

**Independent Test**: Can be tested by filtering to zero results and observing the Export button state and tooltip.

**Acceptance Scenarios**:
1. **Given** there are no transactions in the current view, **When** the user sees the Export button, **Then** it is disabled and a tooltip explains why.

---

## Functional Requirements

FR1. Users can export the current (filtered or full) transaction list to a CSV file.
FR2. The CSV file includes columns: Date, Type, Category, Amount (VND), Note.
FR3. The filename follows the format: transactions_YYYY-MM-DD.csv (current date).
FR4. Export is performed client-side using the Blob API (no backend required).
FR5. A toast notification is shown on successful export.
FR6. If there are no transactions to export, the Export button is disabled and a tooltip explains why.

## Success Criteria

SC1. Users can download a CSV file with the correct data, columns, and filename from any transaction view.
SC2. Export works instantly in the browser without server interaction.
SC3. Users receive clear feedback (toast) on successful export.
SC4. Export button is always disabled when there are no transactions to export, with a visible explanation.

## Acceptance Criteria

- Exported CSV always matches the visible transaction list (filtered or full).
- CSV columns are always: Date, Type, Category, Amount (VND), Note (in this order).
- Filename always matches transactions_YYYY-MM-DD.csv (today's date).
- Export is always client-side (no backend or API calls).
- Toast notification appears after successful export.
- Export button is disabled and shows a tooltip when there are no transactions to export.

## Implementation Research

- Use Context7 to research best practices for generating CSV files and triggering downloads with the Blob API in modern browsers.
- Ensure proper CSV escaping for commas, quotes, and newlines in data.
- Review accessibility and UX for disabled buttons and tooltips.
